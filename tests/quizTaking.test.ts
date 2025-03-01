import test, { expect } from '@playwright/test';
import {
	clearAllDbEntries,
	clearDbScores,
	createScoreForQuiz3ByStudentName,
	getQuizByMetadata,
	getScore,
	resetQuizzesToTestData,
	resetStudentsAndScores,
	initializeTestTeachers,
	loginAsStudentSecondgrader4 as loginAsStudentSecondGrader4
} from './testutils';

test.beforeAll(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
});

test('Taking a quiz', async ({ page }) => {
	const quizCode = await getQuizByMetadata({
		year: 2425,
		grade: 3,
		quarter: 1,
		sequenceLetter: 'A'
	}).then((quiz) => quiz?.accessCode);

	await loginAsStudentSecondGrader4(page);

	await page.locator(`h2:has-text("Enter Quiz Access Code")`);

	await page.locator('input[name="accessCode"]').fill(quizCode);
	await page.locator('button:has-text("Start Quiz")').click();

	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('1+3 =');
	await page.locator('input[id="userAnswer"]').fill('4');
	await page.locator('button:has-text("Submit"):not([disabled])').click();
	expect(await page.locator('p[id="result-msg"]:has-text("Correct!")')).toBeVisible();
	await page.locator('button:has-text("Next Question")').click();

	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('4÷4 =');
	await page.locator('input[id="userAnswer"]').fill('0');
	await page.locator('button:has-text("Submit"):not([disabled])').click();
	expect(await page.locator('p[id="result-msg"]:has-text("Correct answer: 1")')).toBeVisible();
	await page.locator('button:has-text("Next Question")').click();

	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('9-0 =');
	await page.locator('input[id="userAnswer"]').fill('9');
	await page.locator('button:has-text("Submit"):not([disabled])').click();
	await page.locator('button:has-text("Next Question")').click();

	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('5x5 =');
	await page.locator('input[id="userAnswer"]').fill('25');
	await page.locator('button:has-text("Submit"):not([disabled])').click();
	await page.locator('button:has-text("Next Question")').click();

	expect(await page.locator('h2:has-text("Quiz Complete")')).toBeVisible();
	expect(await page.locator('p:has-text("You got 2 out of 4 correct.")')).toBeVisible();

	const score = await getScore(quizCode);

	while (!score) {
		await getScore(quizCode);
	}

	expect(score.correctAnswers).toBe(2);
	expect(score.student.name).toBe('secondgrader4');
	expect(score.answers).toStrictEqual(['4', '0', '9', '25']);
});

test('Student cannot retake quiz', async ({ page }) => {
	const quiz = await getQuizByMetadata({
		year: 2425,
		grade: 2,
		quarter: 1,
		sequenceLetter: 'A'
	});

	await loginAsStudentSecondGrader4(page);

	await page.locator('input[name="accessCode"]').fill(quiz?.accessCode);
	await page.locator('button:has-text("Start Quiz")').click();
	await expect(page.locator('p:has-text("You\'ve already taken this quiz :)")')).toBeVisible();
});

// todo: test that a student cannot take a quiz that has expired

// todo: test that a quiz expires while a student takes it
