import { Database } from '$lib/database';
import type { Score } from '@prisma/client';

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
	await page.locator(`div[id="grade-btn-2"]`).click();
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
	await db.addStudents([
		{ studentName: 'firstgrader1', teacherName: 'mr_firstgrade' },
		{ studentName: 'firstgrader2', teacherName: 'mr_firstgrade' },
		{ studentName: 'firstgrader3', teacherName: 'mr_firstgrade' },
		{ studentName: 'firstgrader4', teacherName: 'mr_firstgrade' },
		{ studentName: 'firstgrader5', teacherName: 'mr_firstgrade' },
		{ studentName: 'secondgrader1', teacherName: 'mitchinson' },
		{ studentName: 'secondgrader2', teacherName: 'mitchinson' },
		{ studentName: 'secondgrader3', teacherName: 'mitchinson' },
		{ studentName: 'secondgrader4', teacherName: 'mitchinson' },
		{ studentName: 'thirdgrader1', teacherName: 'mrs_thirdgrade' },
		{ studentName: 'thirdgrader2', teacherName: 'mrs_thirdgrade' },
		{ studentName: 'fourthgrader1', teacherName: 'mr_fourthgrade' },
		{ studentName: 'fourthgrader2', teacherName: 'mr_fourthgrade' },
		{ studentName: 'fourthgrader3', teacherName: 'mrs_fourthgrade' },
		{ studentName: 'fourthgrader4', teacherName: 'mrs_fourthgrade' },
		{ studentName: 'fifthgrader1', teacherName: 'mrs_fifthgrade' },
		{ studentName: 'fifthgrader2', teacherName: 'mrs_fifthgrade' }
	]);
}

export async function initializeTestQuizzes(): Promise<void> {
	await db.addQuiz('Quiz 1', '1+2\n3+4\n5+6');
	await db.addQuiz('Quiz 2', '1+2\n3+4\n5+6');
	await db.addQuiz(
		'Quiz 3',
		`1+3
4/4
9-0
5*5`
	);
}

export async function getQuizAccessCodeByTitle(title: string): Promise<string> {
	return (await db.prisma.quiz.findFirst({ where: { title } })).accessCode;
}

export async function getScore(quizCode: string) {
	return await db.prisma.score.findFirst({
		where: { quizCode },
		include: { student: true }
	});
}

export async function printQuizCodes() {
	const quizzes = await getQuizzes();
	quizzes.forEach((quiz) => console.log(quiz.title, quiz.accessCode));
}

export async function getQuizzes() {
	return await db.prisma.quiz.findMany({});
}

export async function createScoreForQuiz3ByStudentName(studentName: string) {
	const quizCode = await getQuizAccessCodeByTitle('Quiz 3');
	const student = await db.prisma.student.findFirst({ where: { name: studentName } });
	await db.prisma.score.create({
		data: {
			quiz: {
				connect: { accessCode: quizCode }
			},
			student: { connect: { id: student.id } },
			correctAnswers: 2
		}
	});
}
