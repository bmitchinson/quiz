import { Database } from '$lib/database';
import type { Quiz, Score } from '@prisma/client';
import { getRandomDateForQuarterAndSequence, getReadableTitleOfQuiz } from '$lib/dataUtils';
import {
	studentGroup1Marcos,
	studentGroup2Burke,
	studentGroup3Doherty,
	studentGroup4Schillo,
	studentGroup5Boyle,
	studentGroup6Eklund,
	studentGroup7Mitchinson,
	studentGroup8RosalesMedina
} from './datasets';
import type { Page } from '@playwright/test';

const db = new Database();

// NOTE: Seed Data Functions //////////////////////////////////////////

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

export async function resetStudentsAndScores(): Promise<void> {
	await db.prisma.score.deleteMany({});
	await db.prisma.student.deleteMany({});

	const studentGroup1 = await db
		.addStudents(studentGroup1Marcos, 'marcos')
		.then((students) => students.map((student) => student.id));

	const studentGroup2 = await db
		.addStudents(studentGroup2Burke, 'burke')
		.then((students) => students.map((student) => student.id));

	const studentGroup3 = await db
		.addStudents(studentGroup3Doherty, 'doherty')
		.then((students) => students.map((student) => student.id));

	const studentGroup4 = await db
		.addStudents(studentGroup4Schillo, 'schillo')
		.then((students) => students.map((student) => student.id));

	const studentGroup5 = await db
		.addStudents(studentGroup5Boyle, 'boyle')
		.then((students) => students.map((student) => student.id));

	const studentGroup6 = await db
		.addStudents(studentGroup6Eklund, 'eklund')
		.then((students) => students.map((student) => student.id));

	const studentGroup7 = await db
		.addStudents(studentGroup7Mitchinson, 'mitchinson')
		.then((students) => students.map((student) => student.id));

	const studentGroup8 = await db
		.addStudents(studentGroup8RosalesMedina, 'rosales-medina')
		.then((students) => students.map((student) => student.id));

	await db.addStudents(['thirdgrader1', 'thirdgrader2'], 'mrs_thirdgrade');

	await db.addStudents(
		['fourthgrader1', 'fourthgrader2', 'fourthgrader3', 'fourthgrader4'],
		'mr_fourthgrade'
	);

	await db.addStudents(['fifthgrader1', 'fifthgrader2'], 'mrs_fifthgrade');

	const groupsToSeedScoresOf = [
		{ s: studentGroup1, sG: (i) => 3.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup2, sG: (i) => 4.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup3, sG: (i) => 2.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup4, sG: (i) => 5.5 + i * 0.2, q: g1QuizCodes },
		{ s: studentGroup5, sG: (i) => 5.5 + i * 0.2, q: g2QuizCodes },
		{ s: studentGroup6, sG: (i) => 6.5 + i * 0.2, q: g2QuizCodes },
		{ s: studentGroup7, sG: (i) => 4.5 + i * 0.2, q: g2QuizCodes },
		{ s: studentGroup8, sG: (i) => 5.5 + i * 0.2, q: g2QuizCodes }
	];

	const scoresToCreate = [];

	groupsToSeedScoresOf.forEach((group) => {
		group.s.forEach((studentId) => {
			group.q.forEach((quizCode, qIndex) => {
				scoresToCreate.push({
					studentId,
					quizCode,
					correctAnswers: group.sG(qIndex),
					createdAt: getRandomDateForQuarterAndSequence(
						parseInt(quizCode.charAt(2)), // quarter
						parseInt(quizCode.charAt(3)) // sequence
					)
				});
			});
		});
	});

	//////////////////////////////////////////////////////////////////
	await db.prisma.score.createMany({
		data: scoresToCreate
	});
}

export async function resetQuizzesToTestData(): Promise<void> {
	await db.prisma.quiz.deleteMany({});
	const quizzesToMake: Partial<Quiz>[] = [];
	[1, 2].forEach((grade, x) => {
		[1, 2, 3, 4].forEach((quarter, y) => {
			['A', 'B', 'C', 'D'].forEach((sequenceLetter, z) => {
				quizzesToMake.push({
					title: 'temp',
					accessCode: '0' + x + y + z,
					questionsData: '1+2|3+4|5+6|1+2|3+4|5+6|1+2|3+4|5+6|0+0',
					totalQuestions: 10,
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

export const clearAllDbEntries = async () => {
	await db.prisma.student.deleteMany({});
	await db.prisma.teacher.deleteMany({});
	await db.prisma.quiz.deleteMany({});
	await clearDbScores();
};

export const clearDbScores = async () => {
	await db.prisma.score.deleteMany({});
};

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

// NOTE: Database Gets //////////////////////////////////////////

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

// NOTE: Common UI Ops //////////////////////////////////////////

export const loginAsAdmin = async (page: Page) => {
	await page.goto('/login');
	await page.locator(`button:has-text("Admin")`).click();
	await page.locator(`input`).fill('admin');
	await page.locator(`button:has-text("Submit")`).click();
};

export const loginAsTeacher = async (page: Page, teacherName = 'mitchinson') => {
	await page.goto('/login');
	await page.locator(`button:has-text("Teacher")`).click();
	await page.locator(`#teacherName`).fill(teacherName);
	await page.locator(`#teacherPassword`).fill('teacher');
	await page.locator(`button:has-text("Submit")`).click();
};

export const loginAsStudentSecondgrader4 = async (page: Page) => {
	await page.goto('/login');
	await page.locator(`button:has-text("Student")`).click();
	await page.locator(`div[id="grade-select-2"]`).click();
	await page.selectOption('select', 'mitchinson');
	await page.locator(`#studentName`).fill('secondgrader4');
	await page.locator(`button:has-text("Submit")`).click();
};

export const amountOfStudentsForTeacher = async (teacherName: string): Promise<number> => {
	return (await db.prisma.student.findMany({ where: { teacher: { name: teacherName } } })).length;
};

export async function addFourSecondGraderStudents() {
	await db.addStudents(
		['secondgrader1', 'secondgrader2', 'secondgrader3', 'secondgrader4'],
		'mitchinson'
	);
}

// NOTE: Utils //////////////////////////////////////////

const g1QuizCodes = [
	'0000',
	'0001',
	'0002',
	'0003',
	'0010',
	'0011',
	'0012',
	'0013',
	'0020',
	'0021',
	'0022',
	'0023',
	'0030',
	'0031',
	'0032',
	'0033'
];

const g2QuizCodes = [
	'0100',
	'0101',
	'0102',
	'0103',
	'0110',
	'0111',
	'0112',
	'0113',
	'0120',
	'0121',
	'0122',
	'0123',
	'0130',
	'0131',
	'0132',
	'0133'
];

export function _50Chance(): boolean {
	return Math.random() < 0.5;
}
