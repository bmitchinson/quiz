// src/lib/database.ts

import { PrismaClient, type Quiz } from '@prisma/client';
import { getReadableTitleOfQuiz } from './dataUtils';
import { tempDisablePrismaQuery } from './config';
import { logDBError } from './logging';

export interface GetScoresScore {
	id: number;
	correctAnswers: number;
	createdAt: Date;
	quiz: Quiz;
	quizTitle: string;
	student: { name: string; teacher: { name: string; grade: number } };
}

export interface GetScoresFilters {
	grade: number;
	teacherName: string;
	quizCode: string;
	studentName: string;
	quizQuarter: number;
	quizSequenceLetter: string;
}

export interface GetDrawingsResult {
	drawings: {
		id: number;
		jpgBase64: string;
		student: {
			name: string;
		};
		accessCode: string;
		quiz: {
			title: string;
			grade: number;
			quarter: number;
			sequenceLetter: string;
		};
		timeStarted: Date;
	}[];
	total: number;
}

const logLevels = /production|test/.test(process.env.NODE_ENV)
	? ['warn', 'error']
	: tempDisablePrismaQuery
		? ['info', 'warn', 'error']
		: ['query', 'info', 'warn', 'error'];

export const prisma = new PrismaClient({
	log: logLevels
});

function generate4DigitCode(): string {
	return String(Math.floor(1000 + Math.random() * 9000)).padStart(4, '0');
}

/**
 * Database class encapsulating Prisma Client operations.
 * Provides methods to interact with the database.
 */
export class Database {
	public prisma: PrismaClient;

	constructor() {
		this.prisma = prisma;
	}

	async generateUnique4DigitCode(): string {
		let attempts = 0;

		while (attempts < 10) {
			let accessCode = generate4DigitCode();

			const existingEntity = await prisma.quiz.findUnique({
				where: { accessCode }
			});

			if (!existingEntity) {
				return accessCode;
			}

			attempts++;
		}

		throw new Error('Failed to generate a unique 4 digit quiz code after 10 attempts');
	}

	async addTeacher(name: string, grade: number): Promise<void> {
		try {
			await this.prisma.teacher.create({
				data: {
					name,
					grade
				}
			});
		} catch (error) {
			logDBError('database', 'Error adding teacher', error);
			throw error;
		}
	}

	async getTeacher(lastname: string) {
		try {
			return await this.prisma.teacher.findFirst({
				where: { name: lastname }
			});
		} catch (error) {
			logDBError('database', 'Error looking up teacher', error);
			throw error;
		}
	}

	async getAllTeachers() {
		return await prisma.teacher.findMany({
			select: { name: true, grade: true }
		});
	}

	async addStudents(studentNames: string[], teacherName: string) {
		try {
			return await this.prisma.$transaction(async (prisma) => {
				const teacher = await prisma.teacher.findUnique({
					where: { name: teacherName }
				});

				await prisma.student.updateMany({
					where: {
						name: { in: studentNames.map((n) => n.toLowerCase()) },
						teacherId: teacher.id
					},
					data: { archived: false }
				});

				const dataToInsert = studentNames.map((studentName) => ({
					name: studentName.toLowerCase(),
					teacherId: teacher.id
				}));

				return await prisma.student.createManyAndReturn({
					select: { id: true, name: true },
					data: dataToInsert,
					skipDuplicates: true
				});
			});
		} catch (error) {
			logDBError('database', 'Error adding students', error);
			throw error;
		}
	}

	async startDrawing(studentId: string, accessCode: string): Promise<void> {
		try {
			return await this.prisma.drawing.create({
				data: {
					studentId: parseInt(studentId),
					accessCode,
					timeStarted: new Date()
				}
			});
		} catch (error) {
			logDBError('database', 'Error starting drawing', error);
			throw error;
		}
	}

	async saveDrawingImage(studentId: string, accessCode: string, jpgBase64: string): Promise<void> {
		try {
			return await this.prisma.drawing.update({
				where: {
					accessCode_studentId: {
						accessCode,
						studentId: parseInt(studentId)
					}
				},
				data: {
					jpgBase64
				}
			});
		} catch (error) {
			logDBError('database', 'Error saving drawing image data', error);
			throw error;
		}
	}

	async getDrawing(studentId: string, accessCode: string) {
		try {
			return await this.prisma.drawing.findFirst({
				where: {
					studentId: parseInt(studentId),
					accessCode
				}
			});
		} catch (error) {
			logDBError('database', 'Error fetching drawing', error);
			throw error;
		}
	}

	async getDrawings(
		page = 1,
		pageSize = 5,
		filters: { grade?: number; teacherName?: string } = {}
	): Promise<GetDrawingsResult> {
		try {
			const skip = (page - 1) * pageSize;

			const where = {
				jpgBase64: { not: null },
				student: {
					...(filters.teacherName && { teacher: { name: filters.teacherName } }),
					...(filters.grade && { teacher: { grade: filters.grade } })
				}
			};

			console.log('where', where);

			const [drawings, total] = await Promise.all([
				this.prisma.drawing.findMany({
					where,
					select: {
						id: true,
						jpgBase64: true,
						student: {
							select: {
								name: true
							}
						},
						accessCode: true,
						quiz: {
							select: {
								title: true,
								grade: true,
								quarter: true,
								sequenceLetter: true
							}
						},
						timeStarted: true
					},
					skip,
					take: pageSize,
					orderBy: {
						timeStarted: 'desc'
					}
				}),
				this.prisma.drawing.count({ where })
			]);

			return { drawings, total };
		} catch (error) {
			logDBError('database', 'Error fetching drawings', error);
			throw error;
		}
	}

	async getStudent(studentName: string) {
		try {
			return await this.prisma.student.findFirst({
				select: { teacher: true },
				where: { name: studentName, archived: false }
			});
		} catch (error) {
			logDBError('database', 'Error doing single student lookup', error);
			throw error;
		}
	}

	async getStudentsOfTeacher(teacherId: number) {
		try {
			if (teacherId === null) {
				throw new Error('Missing teacher id');
			}
			const students = await this.prisma.student.findMany({
				select: { name: true, id: true },
				where: { archived: false, teacherId },
				orderBy: { name: 'asc' }
			});
			return students;
		} catch (error) {
			logDBError('database', 'Error fetching students', error);
			throw error;
		}
	}

	// todo: year - make selector in UI
	async getSummaryOfScores(grade: number, teacherName: string, year = 2425) {
		try {
			const summary = await prisma.score.groupBy({
				by: ['quizCode'],
				where: {
					quiz: {
						grade,
						year
					},
					student: {
						archived: false,
						...(teacherName !== 'all' && {
							teacher: {
								name: teacherName
							}
						})
					}
				},
				_avg: {
					correctAnswers: true
				},
				_count: {
					id: true
				}
			});
			return summary.reduce(
				(acc, summary) => {
					acc[summary.quizCode] = summary;
					return acc;
				},
				{} as {
					[quizCode: string]: {
						_avg: { correctAnswers: number };
						_count: { id: number };
						quizCode: string;
					};
				}
			);
		} catch (error) {
			logDBError('database', 'Error getting a summary of scores', error);
			throw error;
		}
	}

	async getScores(filters: GetScoresFilters): Promise<GetScoresScore[]> {
		try {
			const scores = await prisma.score.findMany({
				where: {
					quiz: {
						accessCode: filters?.quizCode || undefined,
						quarter: filters?.quizQuarter || undefined,
						sequenceLetter: filters?.quizSequenceLetter || undefined
					},
					student: {
						name: filters?.studentName || undefined,
						archived: false,
						teacher: {
							name: filters?.teacherName || undefined,
							grade: filters?.grade
						}
					}
				},
				select: {
					id: true,
					correctAnswers: true,
					createdAt: true,
					quiz: true,
					student: {
						select: {
							name: true,
							teacher: {
								select: {
									name: true,
									grade: true
								}
							}
						}
					}
				},
				orderBy: {
					createdAt: 'desc'
				}
			});
			return scores.map((score) => ({
				...score,
				quizTitle: getReadableTitleOfQuiz(score.quiz)
			}));
		} catch (error) {
			logDBError('database', 'Error fetching scores', error);
			throw error;
		}
	}

	async archiveStudent(name: string, teacherId: int): Promise<void> {
		try {
			// using updateMany instead of update because prisma doesn't know that
			// name is unique within a teacherId
			await this.prisma.student.updateMany({
				where: { name, teacherId },
				data: { archived: true }
			});
		} catch (error) {
			logDBError('database', 'Error deleting student', error);
			throw error;
		}
	}

	async markQuizEndedEarly(accessCode: number, studentId: number): Promise<void> {
		try {
			await this.prisma.score.upsert({
				where: {
					quizCode_studentId: {
						quizCode: accessCode,
						studentId
					}
				},
				update: { quizEndedEarly: true },
				create: {
					quizCode: accessCode,
					studentId,
					quizEndedEarly: true
				}
			});
		} catch (error) {
			logDBError(
				'database',
				`Error marking quiz ended early for student ${studentId} / quizCode ${accessCode}:`,
				error
			);
			throw error;
		}
	}

	async addQuiz(
		metadata: {
			year: number;
			grade: number;
			quarter: number;
			sequenceLetter: string;
		},
		providedQuestionsText: string
	): Promise<void> {
		try {
			const questions = providedQuestionsText.replace(/\r?\n/g, '|');
			const quiz = await this.prisma.quiz.create({
				data: {
					title: 'temp',
					accessCode: await this.generateUnique4DigitCode(),
					questionsData: questions,
					totalQuestions: questions.split('|').length,
					year: metadata.year,
					grade: metadata.grade,
					quarter: metadata.quarter,
					sequenceLetter: metadata.sequenceLetter
				}
			});
		} catch (error) {
			logDBError('database', 'Error adding quiz', error);
			throw error;
		}
	}

	async updateOrCreateScore(
		correctAnswers: number,
		timeStarted: Date,
		timeFinished: Date,
		studentId: string,
		quizCode: string,
		answers: string[]
	): Promise<{ quiz: Quiz }> {
		try {
			return await this.prisma.score.upsert({
				where: {
					quizCode_studentId: {
						quizCode,
						studentId
					}
				},
				update: {
					correctAnswers,
					timeStarted,
					timeFinished,
					answers
				},
				create: {
					quizCode,
					studentId,
					correctAnswers,
					timeStarted,
					timeFinished,
					answers
				},
				select: { quiz: true }
			});
		} catch (error) {
			logDBError('database', 'Error adding score', error);
			throw error;
		}
	}

	async getQuiz(accessCode: string) {
		try {
			return await this.prisma.quiz.findFirst({
				where: { accessCode, archived: false }
			});
		} catch (error) {
			logDBError('database', 'Error looking up quiz', error);
			throw error;
		}
	}

	async getQuizzesByAccessCodes(accessCodes: string[]): { [accessCode: string]: Quiz } {
		try {
			const quizzes = await prisma.quiz.findMany({
				where: {
					accessCode: {
						in: accessCodes
					},
					archived: false
				}
			});

			return quizzes.reduce((acc, quiz) => {
				acc[quiz.accessCode] = quiz;
				return acc;
			}, {});
		} catch (error) {
			logDBError('database', 'Error looking up quizzes for access codes', error);
			throw error;
		}
	}

	async checkIfScoreExistsForQuizAndStudent(accessCode: string, studentUsername: string) {
		try {
			if (!accessCode || !studentUsername) {
				throw new Error('Missing access code or student name on score db lookup');
			}
			return await this.prisma.score.findFirst({
				where: { quizCode: accessCode, student: { name: studentUsername, archived: false } }
			});
		} catch (error) {
			logDBError('database', 'Error looking up quiz', error);
			throw error;
		}
	}

	async getQuizByMetadata(year: number, grade: number, quarter: number, sequenceLetter: string) {
		try {
			return await this.prisma.quiz.findFirst({
				where: {
					year,
					grade,
					quarter,
					sequenceLetter,
					archived: false
				}
			});
		} catch (error) {
			logDBError('database', 'Error checking if quiz exists', error);
			throw error;
		}
	}

	/**
	 * Archives a quiz by id.
	 * @param id The id of the quiz to archives.
	 */
	async archiveQuiz(id: number): Promise<void> {
		await this.prisma.quiz.update({
			where: { id },
			data: { archived: true }
		});
	}

	async deleteScore(scoreId: number): Promise<void> {
		try {
			const deletedScore = await this.prisma.score.delete({
				where: { id: scoreId },
				select: { id: true, student: true, quizCode: true }
			});
		} catch (error) {
			logDBError('database', `Error deleting score ${scoreId}:`, error);
			throw error;
		}
	}

	async updateQuizQuestions(accessCode: number, questionsData: string): Promise<void> {
		try {
			await this.prisma.quiz.update({
				where: { accessCode, archived: false },
				data: { questionsData, totalQuestions: questionsData.split('|').length }
			});
		} catch (error) {
			logDBError('database', 'Error updated questions on quiz', error);
			throw error;
		}
	}

	/**
	 * @returns Array of quizzes.
	 */
	// todo: year, filter by the year that the app has in env
	async getAllQuizzes() {
		try {
			return await this.prisma.quiz.findMany({
				where: { archived: false },
				include: {
					_count: {
						select: {
							scores: true
						}
					}
				}
			});
		} catch (error) {
			logDBError('database', 'Error fetching quizzes', error);
			throw error;
		}
	}

	async studentBelongsToTeacher(studentName: string, teacherName: string): Promise<boolean> {
		try {
			if (!studentName || !teacherName) {
				throw new Error('Missing student or teacher name on db lookup');
			}
			const student = await this.prisma.student.findFirst({
				where: {
					name: studentName,
					teacher: {
						name: teacherName
					}
				}
			});
			if (student) {
				return student.id;
			} else {
				return 0;
			}
		} catch (error) {
			logDBError('database', 'Error checking if student has teacher', error);
			throw error;
		}
	}

	async deleteDrawing(drawingId: number): Promise<void> {
		try {
			return await this.prisma.drawing.delete({
				where: {
					id: drawingId
				}
			});
		} catch (error) {
			logDBError('database', 'Error deleting drawing', error);
			throw error;
		}
	}
}
