import test, { expect } from '@playwright/test';
import {
	clearAllDbEntries,
	clearDbScores,
	getQuizByMetadata,
	getScore,
	resetQuizzesToTestData,
	resetStudentsAndScores,
	initializeTestTeachers,
	loginAsTestThirdGradeQuizTaker,
	eraseThirdGradeTestTakerScores,
	createScoreForQuiz,
	thirdGradeQuizTakerName,
	performXDistractions
} from './testutils';

test.beforeAll(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
});

test.beforeEach(async () => {
	await eraseThirdGradeTestTakerScores();
});

test('Taking a quiz', async ({ page }) => {
	const quizCode = await getQuizByMetadata({
		year: 2425,
		grade: 3,
		quarter: 1,
		sequenceLetter: 'A'
	}).then((quiz) => quiz?.accessCode);

	await loginAsTestThirdGradeQuizTaker(page);

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
	expect(score.student.name).toBe('thirdgrader1');
	expect(score.answers).toStrictEqual(['4', '0', '9', '25']);
});

test('Student cannot retake quiz', async ({ page }) => {
	const quiz = await getQuizByMetadata({
		year: 2425,
		grade: 3,
		quarter: 1,
		sequenceLetter: 'A'
	});
	await createScoreForQuiz(quiz?.accessCode, thirdGradeQuizTakerName, ['4', '0', '9', '25']);

	await loginAsTestThirdGradeQuizTaker(page);

	await page.locator('input[name="accessCode"]').fill(quiz?.accessCode);
	await page.locator('button:has-text("Start Quiz")').click();
	await expect(page.locator('p:has-text("You\'ve already taken this quiz :)")')).toBeVisible();
});

test('Student can resume a quiz', async ({ page }) => {
	const quiz = await getQuizByMetadata({
		year: 2425,
		grade: 3,
		quarter: 1,
		sequenceLetter: 'A'
	});
	await createScoreForQuiz(quiz?.accessCode, thirdGradeQuizTakerName, ['4', '0']);

	await loginAsTestThirdGradeQuizTaker(page);

	await page.locator('input[name="accessCode"]').fill(quiz?.accessCode);
	await page.locator('button:has-text("Start Quiz")').click();
	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('9-0 =');
});

test('Student that is distracted during a quiz has their score marked accordingly', async ({
	page
}) => {
	const quiz = await getQuizByMetadata({
		year: 2425,
		grade: 3,
		quarter: 1,
		sequenceLetter: 'A'
	});

	await loginAsTestThirdGradeQuizTaker(page);

	await page.locator(`h2:has-text("Enter Quiz Access Code")`);

	await page.locator('input[name="accessCode"]').fill(quiz?.accessCode);
	await page.locator('button:has-text("Start Quiz")').click();
	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('1+3 =');

	// getting distracted shows a warning
	await performXDistractions(page, 1);
	await expect(page.locator('p:has-text("Warning: Loss of focus detected.")')).toBeVisible();

	// warning is cleared when a question is answered
	await page.locator('input[id="userAnswer"]').fill('4');
	await page.locator('button:has-text("Submit"):not([disabled])').click();
	await page.locator('button:has-text("Next Question")').click();
	await expect(page.locator('p:has-text("Warning: Loss of focus detected.")')).not.toBeVisible();

	// further distractions lock student from quiz
	await performXDistractions(page, 4);
	await expect(page.locator('p:has-text("Quiz ended early")')).toBeVisible();
	await page.locator('button:has-text("Back")').click();

	// try to take quiz that was marked as being distracted for:
	await page.locator('input[name="accessCode"]').fill(quiz?.accessCode);
	await page.locator('button:has-text("Start Quiz")').click();
	await expect(page.locator('p:has-text("Quiz ended early")')).toBeVisible();
});

test('Student cannot take a quiz from another grade', async ({ page }) => {
	const quizCodeOfSecondGrade = await getQuizByMetadata({
		year: 2425,
		grade: 2,
		quarter: 1,
		sequenceLetter: 'A'
	}).then((quiz) => quiz?.accessCode);

	await loginAsTestThirdGradeQuizTaker(page);

	await page.locator(`h2:has-text("Enter Quiz Access Code")`);

	await page.locator('input[name="accessCode"]').fill(quizCodeOfSecondGrade);
	await page.locator('button:has-text("Start Quiz")').click();
	await expect(page.locator('p:has-text("This quiz is not for your grade level")')).toBeVisible();
});

// todo: test that a student cannot take a quiz that has expired

// todo: test that a quiz expires while a student takes it
