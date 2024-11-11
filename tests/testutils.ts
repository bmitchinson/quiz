import { Database } from '$lib/database';
import type { Score } from '@prisma/client';
import { getReadableTitleOfQuiz } from '$lib/dataUtils';
import {
	studentGroup1,
	studentGroup2,
	studentGroup3,
	studentGroup4,
	studentGroup5,
	studentGroup6,
	studentGroup7,
	studentGroup8
} from './datasets';

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
	await db.addTeacher('marcos', 1);
	await db.addTeacher('burke', 1);
	await db.addTeacher('doherty', 1);
	await db.addTeacher('schillo', 1);
	await db.addTeacher('boyle', 2);
	await db.addTeacher('eklund', 2);
	await db.addTeacher('mitchinson', 2);
	await db.addTeacher('rosales-medina', 2);
	await db.addTeacher('mrs_thirdgrade', 3);
	await db.addTeacher('mr_fourthgrade', 4);
	await db.addTeacher('mrs_fourthgrade', 4);
	await db.addTeacher('mrs_fifthgrade', 5);
}

export async function initializeTestStudents(): Promise<void> {
	await db.addStudents(
		[
			'firstgrader1',
			'firstgrader2',
			'firstgrader3',
			'firstgrader4',
			'firstgrader5',
			...studentGroup1
		],
		'marcos'
	);

	await db.addStudents(studentGroup2, 'burke');
	await db.addStudents(studentGroup3, 'doherty');
	await db.addStudents(studentGroup4, 'schillo');

	await db.addStudents(studentGroup5, 'boyle');
	await db.addStudents(studentGroup6, 'eklund');
	await db.addStudents(
		['secondgrader1', 'secondgrader2', 'secondgrader3', 'secondgrader4', ...studentGroup7],
		'mitchinson'
	);
	await db.addStudents(studentGroup8, 'rosales-medina');

	await db.addStudents(['thirdgrader1', 'thirdgrader2'], 'mrs_thirdgrade');

	await db.addStudents(
		['fourthgrader1', 'fourthgrader2', 'fourthgrader3', 'fourthgrader4'],
		'mr_fourthgrade'
	);

	await db.addStudents(['fifthgrader1', 'fifthgrader2'], 'mrs_fifthgrade');
}

export async function resetQuizzesToTestData(): Promise<void> {
	await db.prisma.quiz.deleteMany({});
	const quizzesToMake = [];
	[1, 2].forEach((grade, x) => {
		[1, 2, 3, 4].forEach((quarter, y) => {
			['A', 'B', 'C', 'D'].forEach((sequenceLetter, z) => {
				quizzesToMake.push({
					title: 'temp',
					accessCode: '0' + x + y + z,
					questionsData: '1+2|3+4|5+6|1+2|3+4|5+6|1+2|3+4|5+6|0+0',
					totalQuestions: 3,
					year: 2425,
					grade,
					quarter,
					sequenceLetter
				});
			});
		});
	});
	await db.prisma.quiz.createMany({ data: quizzesToMake });

	await db.addQuiz(
		{ year: 2425, grade: 3, quarter: 1, sequenceLetter: 'A' },
		`1+3
4/4
9-0
5*5`
	);

	await db.addQuiz(
		{ year: 2425, grade: 3, quarter: 1, sequenceLetter: 'B' },
		`1+2
3+4
5+6`
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

export async function resetScoresToTestData() {
	await db.prisma.score.deleteMany({});

	const grade1QuizIds = await db.prisma.quiz
		.findMany({ where: { grade: 1 } })
		.then(async (quizzes) => quizzes.map((quiz) => quiz.accessCode));
	const grade2QuizIds = await db.prisma.quiz
		.findMany({ where: { grade: 2 } })
		.then(async (quizzes) => quizzes.map((quiz) => quiz.accessCode));

	await db.prisma.score.createMany({
		data: studentGroup1.map((studentName) => {
			return {
				correctAnswers: 7,
				quiz: { connect: { accessCode: '0000' } },
				student: { connect: { name: studentName } }
			};
		})
	});
}
