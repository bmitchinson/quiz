import test, { expect } from '@playwright/test';
import {
	clearAllDbEntries,
	initializeTestTeachers,
	loginAsAdmin,
	loginAsTeacher,
	resetQuizzesToTestData,
	resetStudentsAndScores
} from './testutils';

test.beforeAll(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
});

test('Admin table visual reg', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();

	// 1st grade
	await page.waitForTimeout(2500);
	await expect(page).toHaveScreenshot('firstgrade.png');
	await page.mouse.move(649, 430);
	await page.waitForTimeout(200);
	await expect(page).toHaveScreenshot('firstgrade_tooltip.png');

	// 2nd grade
	await page.locator('div[id="grade-select-2"]').click();
	await page.waitForTimeout(1500);
	await page.mouse.move(649, 404);
	await page.waitForTimeout(200);
	await expect(page).toHaveScreenshot('secondgrade_tooltip.png');
});

test('Teacher table shows **no** scores', async ({ page }) => {
	await loginAsTeacher(page, 'mrs_thirdgrade');
	await page.locator('a:has-text("View Class Scores")').click();

	await page.waitForTimeout(1500);
	await expect(page).toHaveScreenshot('mrs_thirdgrade_no_scores.png');
});

test('Teacher table shows scores', async ({ page }) => {
	await loginAsTeacher(page, 'mitchinson');
	await page.locator('a:has-text("View Class Scores")').click();

	await page.waitForTimeout(1500);
	await page.mouse.move(649, 404);
	await page.waitForTimeout(200);
	await expect(page).toHaveScreenshot('mitchinson_teacher_scores_tooltip.png');
});
