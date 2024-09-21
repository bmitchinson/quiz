// src/lib/database.ts

import { PrismaClient } from '@prisma/client';

// Ensure a single instance of PrismaClient is used in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log: ['query', 'info', 'warn', 'error']
	});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Database class encapsulating Prisma Client operations.
 * Provides methods to interact with the database.
 */
export class Database {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = prisma;
	}

	/**
	 * Adds multiple unique student last names to the database.
	 * Uses upsert to avoid duplicates.
	 * @param lastNames Array of unique student last names.
	 */
	async addStudents(lastNames: string[]): Promise<void> {
		try {
			const createPromises = lastNames.map((lastName) =>
				this.prisma.student.upsert({
					where: { lastName },
					update: {},
					create: { lastName }
				})
			);

			await this.prisma.$transaction(createPromises);
			console.log('Added Students:', lastNames);
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
				select: { lastName: true },
				orderBy: { lastName: 'asc' }
			});
			return students.map((student) => student.lastName);
		} catch (error) {
			console.error('Error fetching students:', error);
			throw error;
		}
	}

	/**
	 * Additional database methods can be added here.
	 * For example, deleting a student, updating student details, etc.
	 */
}
