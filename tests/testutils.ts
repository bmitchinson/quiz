import { Database } from '$lib/database';
import type { Score } from '@prisma/client';
import { getReadableTitleOfQuiz } from '$lib/dataUtils';

const db = new Database();

export const loginAsAdmin = async (page) => {
	await page.goto('/login');
	await page.locator(`button:has-text("Admin")`).click();
	await page.locator(`input`).fill('admin');
	await page.locator(`button:has-text("Submit")`).click();
};

export const loginAsTeacher = async (page) => {
	await page.goto('/login');
	await page.locator(`button:has-text("Teacher")`).click();
	await page.locator(`#teacherName`).fill('mitchinson');
	await page.locator(`#teacherPassword`).fill('teacher');
	await page.locator(`button:has-text("Submit")`).click();
};

export const loginAsStudentSecondgrader4 = async (page) => {
	await page.goto('/login');
	await page.locator(`button:has-text("Student")`).click();
	await page.locator(`div[id="grade-select-2"]`).click();
	await page.selectOption('select', 'mitchinson');
	await page.locator(`#studentName`).fill('secondgrader4');
	await page.locator(`button:has-text("Submit")`).click();
};

export const clearAllDbEntries = async () => {
	await db.prisma.student.deleteMany({});
	await db.prisma.teacher.deleteMany({});
	await db.prisma.quiz.deleteMany({});
	await clearDbScores();
};

export const clearDbScores = async () => {
	await db.prisma.score.deleteMany({});
};

export const amountOfStudentsForTeacher = async (teacherName: string): Promise<number> => {
	return (await db.prisma.student.findMany({ where: { teacher: { name: teacherName } } })).length;
};

export async function initializeTestTeachers(): Promise<void> {
	await db.addTeacher('mr_firstgrade', 1);
	await db.addTeacher('mitchinson', 2);
	await db.addTeacher('mrs_thirdgrade', 3);
	await db.addTeacher('mr_fourthgrade', 4);
	await db.addTeacher('mrs_fourthgrade', 4);
	await db.addTeacher('mrs_fifthgrade', 5);
}

export async function initializeTestStudents(): Promise<void> {
	await db.addStudents(
		['firstgrader1', 'firstgrader2', 'firstgrader3', 'firstgrader4', 'firstgrader5'],
		'mr_firstgrade'
	);

	await db.addStudents(
		['secondgrader1', 'secondgrader2', 'secondgrader3', 'secondgrader4'],
		'mitchinson'
	);

	await db.addStudents(['thirdgrader1', 'thirdgrader2'], 'mrs_thirdgrade');

	await db.addStudents(
		['fourthgrader1', 'fourthgrader2', 'fourthgrader3', 'fourthgrader4'],
		'mr_fourthgrade'
	);

	await db.addStudents(['fifthgrader1', 'fifthgrader2'], 'mrs_fifthgrade');
}

export async function resetQuizzesToTestData(): Promise<void> {
	await db.prisma.quiz.deleteMany({});
	await db.addQuiz({ year: 2425, grade: 1, quarter: 1, sequenceLetter: 'A' }, '1+2\n3+4\n5+6');
	await db.addQuiz({ year: 2425, grade: 2, quarter: 1, sequenceLetter: 'A' }, '1+2\n3+4\n5+6');
	await db.addQuiz(
		{ year: 2425, grade: 3, quarter: 1, sequenceLetter: 'A' },
		`1+3
4/4
9-0
5*5`
	);
}

export async function getQuizByMetadata(opts: {
	year: number;
	grade: number;
	quarter: number;
	sequenceLetter: string;
}) {
	return await db.getQuizByMetadata(opts.year, opts.grade, opts.quarter, opts.sequenceLetter);
}

export async function getScore(quizCode: string) {
	return await db.prisma.score.findFirst({
		where: { quizCode },
		include: { student: true }
	});
}

export async function printQuizCodes() {
	const quizzes = await getQuizzes();
	quizzes.forEach((quiz) => console.log(`${getReadableTitleOfQuiz(quiz)} - ${quiz.accessCode}`));
}

export async function getQuizzes() {
	return await db.prisma.quiz.findMany({});
}

export async function createScoreForQuiz3ByStudentName(studentName: string) {
	const quiz = await getQuizByMetadata({
		year: 2425,
		grade: 3,
		quarter: 1,
		sequenceLetter: 'A'
	});
	const student = await db.prisma.student.findFirst({ where: { name: studentName } });
	await db.prisma.score.create({
		data: {
			quiz: {
				connect: { accessCode: quiz?.accessCode }
			},
			student: { connect: { id: student.id } },
			correctAnswers: 2
		}
	});
}
