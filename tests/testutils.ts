import { Database } from '../src/lib/database';

const db = new Database();

export async function resetStudentsToTestData(): Promise<void> {
	await db.prisma.student.deleteMany({});
	await db.addStudents([
		'asmith',
		'bjohnson',
		'cbrown',
		'dtaylor',
		'eclark',
		'fmiller',
		'gwilson',
		'hmoore',
		'ijones',
		'jgarcia'
	]);
}

export async function resetQuizzesToTestData(): Promise<void> {
	await db.prisma.quiz.deleteMany({});
	await db.addQuiz('Quiz 1', '1+2\n3+4\n5+6');
	await db.addQuiz('Quiz 2', '1+2\n3+4\n5+6');
	await db.addQuiz('Quiz 3', '7+8\n9+1\n4+6');
}
