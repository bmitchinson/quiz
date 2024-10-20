// src/lib/database.ts

import { PrismaClient, type Quiz } from '@prisma/client';

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

	async addStudents(students: { studentName: string; teacherName: string }[]): Promise<void> {
		try {
			await this.prisma.$transaction(async (prisma) => {
				for (const { studentName: name, teacherName } of students) {
					const lowerName = name.toLowerCase();
					const teacher = await prisma.teacher.findUnique({
						where: { name: teacherName }
					});
					if (!teacher) {
						throw new Error(`Teacher with name ${teacherName} not found`);
					}
					await prisma.student.create({
						data: {
							name: lowerName,
							teacherId: teacher.id
						}
					});
				}
			});
			console.log(
				'Added Students:',
				students.map((s) => s.studentName)
			);
		} catch (error) {
			console.error('Error adding students:', error);
			throw error;
		}
	}

	async findStudentByName(name: string): Promise<void> {
		try {
			return await this.prisma.student.findFirst({
				where: { name, archived: false }
			});
		} catch (error) {
			console.error('Error finding student:', error);
			throw error;
		}
	}

	/**
	 * Retrieves all student last names from the database.
	 * @returns Array of student last names.
	 */
	async getAllStudents(): Promise<string[]> {
		try {
			const students = await this.prisma.student.findMany({
				select: { name: true },
				where: { archived: false },
				orderBy: { name: 'asc' }
			});
			return students;
		} catch (error) {
			console.error('Error fetching students:', error);
			throw error;
		}
	}

	/**
	 * Archives a student by name.
	 * @param name The name of the student to archive.
	 */
	async archiveStudent(name: string): Promise<void> {
		try {
			await this.prisma.student.update({
				where: { name },
				data: { archived: true }
			});
			console.log('Archived Student:', name);
		} catch (error) {
			console.error('Error deleting student:', error);
			throw error;
		}
	}

	/**
	 * Creates a quiz
	 * @param title title of the quiz
	 * @param questionsData newline separated math questions, no '=', just the question
	 */
	async addQuiz(title: string, questionsData: string): Promise<void> {
		try {
			await this.prisma.quiz.create({
				data: {
					title,
					accessCode: await this.generateUnique4DigitCode(),
					questionsData: questionsData.replace(/\r?\n/g, '|'),
					totalQuestions: questionsData.split('\n').length
				}
			});

			console.log('Added Quiz:', title);
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

	async getQuiz(accessCode: string): Promise<void> {
		try {
			return await this.prisma.quiz.findFirst({
				where: { accessCode, archived: false }
			});
		} catch (error) {
			console.error('Error looking up quiz:', error);
			throw error;
		}
	}

	async checkIfScoreExistsForQuizAndStudent(
		accessCode: string,
		studentUsername: string
	): Promise<void> {
		try {
			return await this.prisma.score.findFirst({
				where: { quizCode: accessCode, studentName: studentUsername }
			});
		} catch (error) {
			console.error('Error looking up quiz:', error);
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

	/**
	 * @returns Array of quizzes.
	 */
	async getAllQuizzes(): Promise<Quiz[]> {
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
