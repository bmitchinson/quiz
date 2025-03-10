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

test('Admin barchart visual reg first grade **no** tooltip', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();

	await page.waitForTimeout(2500);
	await expect(page.locator('div[id=scorechart-card]')).toHaveScreenshot(
		'admin-firstgrade-no-tooltip-barchart.png'
	);
});

test('Admin barchart visual reg first grade tooltip', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();

	await page.waitForTimeout(2500);
	await page.mouse.move(649, 430);
	await page.waitForTimeout(200);
	await expect(page.locator('div[id=scorechart-card]')).toHaveScreenshot(
		'admin-firstgrade-tooltip-barchart.png'
	);
});

test('Admin barchart visual reg second grade', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();

	// 2nd grade
	await page.locator('div[id="grade-select-2"]').click();
	await page.waitForTimeout(1500);
	await page.mouse.move(649, 404);
	await page.waitForTimeout(200);
	await expect(page.locator('div[id=scorechart-card]')).toHaveScreenshot(
		'admin-secondgrade-tooltip-barchart.png'
	);
});

test('Teacher barchart shows **no** scores', async ({ page }) => {
	await loginAsTeacher(page, 'mrs_thirdgrade');
	await page.locator('a:has-text("View Class Scores")').click();

	await page.waitForTimeout(1500);
	await expect(page.locator('div[id=scorechart-card]')).toHaveScreenshot(
		'teacher-mrs-thirdgrade-empty-barchart.png'
	);
});

test('Teacher barchart shows scores', async ({ page }) => {
	await loginAsTeacher(page, 'mitchinson');
	await page.locator('a:has-text("View Class Scores")').click();

	await page.waitForTimeout(1500);
	await page.mouse.move(649, 404);
	await page.waitForTimeout(200);
	await expect(page.locator('div[id=scorechart-card]')).toHaveScreenshot(
		'teacher-mitchinson-scores-tooltip-barchart.png'
	);
});
