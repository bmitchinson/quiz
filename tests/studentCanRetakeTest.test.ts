import test, { expect } from '@playwright/test';
import {
	clearAllDbEntries,
	getQuizByMetadata,
	initializeTestTeachers,
	loginAsAdmin,
	loginAsFirstAlphaFirstGrader,
	resetQuizzesToTestData,
	resetStudentsAndScores
} from './testutils';
import { getCurrentYearInt } from './testutils';

test.beforeAll(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
});

test('Student can retake quiz by deleting', async ({ page }) => {
	const quizCode = await getQuizByMetadata({
		year: getCurrentYearInt(),
		grade: 1,
		quarter: 1,
		sequenceLetter: 'A'
	}).then((quiz) => quiz?.accessCode);

	await loginAsFirstAlphaFirstGrader(page);
	await page.locator('a:has-text("Take Quiz")').click();

	await page.locator(`h2:has-text("Enter Quiz Access Code")`);
	await page.locator('input[name="accessCode"]').fill(quizCode);
	await page.locator('button:has-text("Start Quiz")').click();
	await expect(page.locator('h2:has-text("Quiz Complete!")')).toBeVisible();

	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();
	await page.waitForTimeout(500);
	await page.locator('button:has-text("Student")').click();

	page.on('dialog', (dialog) => dialog.accept());
	await page.locator('button:has-text("Delete")').first().click();
	await page.waitForTimeout(100);

	await loginAsFirstAlphaFirstGrader(page);
	await page.locator('a:has-text("Take Quiz")').click();

	await page.locator(`h2:has-text("Enter Quiz Access Code")`);
	await page.locator('input[name="accessCode"]').fill(quizCode);
	await page.locator('button:has-text("Start Quiz")').click();
	expect(await page.locator('div[id="displayedQuestion"]').innerText()).toBe('1+2 =');
});
