// src/lib/database.ts

import { PrismaClient, type Quiz } from '@prisma/client';
import { getReadableTitleOfQuiz } from './dataUtils';

const logLevels =
	process.env.NODE_ENV === 'production' ? ['warn', 'error'] : ['query', 'info', 'warn', 'error'];

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
	private prisma: PrismaClient;

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

			console.log('Added teacher:', name);
		} catch (error) {
			console.error('Error adding teacher:', error);
			throw error;
		}
	}

	async getTeacher(lastname: string): Promise<void> {
		try {
			return await this.prisma.teacher.findFirst({
				where: { name: lastname }
			});
		} catch (error) {
			console.error('Error looking up teacher:', error);
			throw error;
		}
	}

	async addStudents(studentNames: string[], teacherName: string): Promise<void> {
		try {
			await this.prisma.$transaction(async (prisma) => {
				const teacher = await prisma.teacher.findUnique({
					where: { name: teacherName }
				});
				const dataToInsert = studentNames.map((studentName) => ({
					name: studentName.toLowerCase(),
					teacherId: teacher.id
				}));
				await prisma.student.createMany({
					data: dataToInsert,
					skipDuplicates: true
				});
			});
		} catch (error) {
			console.error('Error adding students:', error);
			throw error;
		}
	}

	async getStudentsOfTeacher(teacherId: int): Promise<string[]> {
		try {
			if (teacherId === null) {
				throw new Error('Missing teacher id');
			}
			const students = await this.prisma.student.findMany({
				select: { name: true },
				where: { archived: false, teacherId },
				orderBy: { name: 'asc' }
			});
			return students;
		} catch (error) {
			console.error('Error fetching students:', error);
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
			console.log('Archived Student:', name);
		} catch (error) {
			console.error('Error deleting student:', error);
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
		questionsData: string
	): Promise<void> {
		try {
			const quiz = await this.prisma.quiz.create({
				data: {
					title: 'temp',
					accessCode: await this.generateUnique4DigitCode(),
					questionsData: questionsData.replace(/\r?\n/g, '|'),
					totalQuestions: questionsData.split('\n').length,
					year: metadata.year,
					grade: metadata.grade,
					quarter: metadata.quarter,
					sequenceLetter: metadata.sequenceLetter
				}
			});

			console.log('Added Quiz:', getReadableTitleOfQuiz(quiz));
		} catch (error) {
			console.error('Error adding quiz:', error);
			throw error;
		}
	}

	async addScore(
		correctAnswers: number,
		timeStarted: Date,
		timeFinished: Date,
		studentId: string,
		quizCode: string
	): Promise<void> {
		try {
			await this.prisma.score.create({
				data: {
					quizCode,
					studentId,
					correctAnswers,
					timeStarted,
					timeFinished
				}
			});
		} catch (error) {
			console.error('Error adding score:', error);
			throw error;
		}
	}

	async getQuiz(accessCode: string) {
		try {
			return await this.prisma.quiz.findFirst({
				where: { accessCode, archived: false }
			});
		} catch (error) {
			console.error('Error looking up quiz:', error);
			throw error;
		}
	}

	async checkIfScoreExistsForQuizAndStudent(accessCode: string, studentUsername: string) {
		try {
			if (!accessCode || !studentUsername) {
				throw new Error('Missing access code or student name on score db lookup');
			}
			return await this.prisma.score.findFirst({
				where: { quizCode: accessCode, student: { name: studentUsername } }
			});
		} catch (error) {
			console.error('Error looking up quiz:', error);
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
			console.error('Error checking if quiz exists:', error);
			throw error;
		}
	}

	/**
	 * Archives a quiz by id.
	 * @param id The id of the quiz to archives.
	 */
	async archiveQuiz(id: number): Promise<void> {
		try {
			await this.prisma.quiz.update({
				where: { id },
				data: { archived: true }
			});
			console.log('Archived quiz with id:', id);
		} catch (error) {
			console.error('Error deleting quiz:', error);
			throw error;
		}
	}

	async updateQuizQuestions(accessCode: number, questionsData: string): Promise<void> {
		try {
			await this.prisma.quiz.update({
				where: { accessCode },
				data: { questionsData }
			});
			console.log('Updated quiz questions of quiz with access code:', accessCode);
		} catch (error) {
			console.error('Error updated questions on quiz:', error);
			throw error;
		}
	}

	/**
	 * @returns Array of quizzes.
	 */
	async getAllQuizzes() {
		try {
			const quizzes = await this.prisma.quiz.findMany({
				where: { archived: false },
				orderBy: { createdAt: 'desc' },
				include: {
					_count: {
						select: {
							scores: true
						}
					}
				}
			});
			return quizzes.map((quiz) => ({
				...quiz,
				associatedScores: quiz._count.scores
			}));
		} catch (error) {
			console.error('Error fetching quizzes:', error);
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
			console.error('Error checking if student has teacher:', error);
			throw error;
		}
	}
}
