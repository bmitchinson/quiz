import test, { expect } from '@playwright/test';
import {
	clearAllDbEntries,
	getQuizByMetadata,
	initializeTestTeachers,
	loginAsAdmin,
	loginAsFirstAlphaFirstGrader,
	loginAsStudentSecondgrader4,
	resetQuizzesToTestData,
	resetStudentsAndScores
} from './testutils';

test.beforeAll(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
});

test('Student can retake quiz by deleting', async ({ page }) => {
	const quizCode = await getQuizByMetadata({
		year: 2425,
		grade: 1,
		quarter: 1,
		sequenceLetter: 'A'
	}).then((quiz) => quiz?.accessCode);

	await loginAsFirstAlphaFirstGrader(page);
	await page.locator(`h2:has-text("Enter Quiz Access Code")`);
	await page.locator('input[name="accessCode"]').fill(quizCode);
	await page.locator('button:has-text("Start Quiz")').click();
	await expect(page.locator('p:has-text("You\'ve already taken this quiz :)")')).toBeVisible();

	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();
	await page.waitForTimeout(500);
	await page.locator('button:has-text("Student")').click();
	await page.locator('button:has-text("Delete")').first().click();
	await page.waitForTimeout(100);

	await loginAsFirstAlphaFirstGrader(page);
	await page.locator(`h2:has-text("Enter Quiz Access Code")`);
	await page.locator('input[name="accessCode"]').fill(quizCode);
	await page.locator('button:has-text("Start Quiz")').click();
	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('1+2 =');
});
