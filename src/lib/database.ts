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
}
