// src/lib/database.ts

import { PrismaClient, type Quiz } from '@prisma/client';

// Ensure a single instance of PrismaClient is used in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: ['query', 'info', 'warn', 'error']
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

function generate6DigitCode(): string {
	return String(Math.floor(100000 + Math.random() * 900000)).padStart(6, '0');
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

	async generateUnique6DigitCode(): string {
		let attempts = 0;

		while (attempts < 10) {
			let accessCode = generate6DigitCode();

			const existingEntity = await prisma.quiz.findUnique({
				where: { accessCode }
			});

			if (!existingEntity) {
				return accessCode;
			}

			attempts++;
		}

		throw new Error('Failed to generate a unique quiz code after 10 attempts');
	}

	/**
	 * Adds multiple unique student last names to the database.
	 * Uses upsert to avoid duplicates.
	 * @param names Array of unique student last names.
	 */
	async addStudents(names: string[]): Promise<void> {
		try {
			const createPromises = names.map((name) => {
				const lowerName = name.toLowerCase();
				return this.prisma.student.upsert({
					where: { name },
					update: {},
					create: { name: lowerName }
				});
			});

			await this.prisma.$transaction(createPromises);
			console.log('Added Students:', names);
		} catch (error) {
			console.error('Error adding students:', error);
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
				orderBy: { name: 'asc' }
			});
			return students;
		} catch (error) {
			console.error('Error fetching students:', error);
			throw error;
		}
	}

	/**
	 * Deletes a student by name.
	 * @param name The name of the student to delete.
	 */
	async deleteStudent(name: string): Promise<void> {
		try {
			await this.prisma.student.delete({
				where: { name }
			});
			console.log('Deleted Student:', name);
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
					questionsData,
					totalQuestions: questionsData.split('\n').length,
					accessCode: await this.generateUnique6DigitCode()
				}
			});

			await this.prisma.$transaction(insertOperation);
			console.log('Added Quiz:', title);
		} catch (error) {
			console.error('Error adding quiz:', error);
			throw error;
		}
	}

	/**
	 * Deletes a quiz by id.
	 * @param id The id of the quiz to delete.
	 */
	async deleteQuiz(id: number): Promise<void> {
		try {
			await this.prisma.quiz.delete({
				where: { id }
			});
			console.log('Deleted quiz with id:', id);
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
}
