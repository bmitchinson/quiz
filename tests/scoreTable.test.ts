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

test('Admin Score table first grade by default', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();

	// 1st grade
	await page.waitForTimeout(2500);
	await expect(page.locator('div[id=scoreTable]')).toHaveScreenshot(
		'admin-firstgrade-scoretable.png',
		{ maxDiffPixelRatio: 0.03 }
	);
});

test('Admin Score table use controls for 2nd grade', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();

	// 2nd grade
	await page.locator('#scoreTableGradeFilter').selectOption({ label: '2nd' });
	await page.locator('#scoreTableFetchData').click();
	await page.waitForTimeout(1500);
	await expect(page.locator('div[id=scoreTable]')).toHaveScreenshot(
		'admin-secondgrade-scoretable.png',
		{ maxDiffPixelRatio: 0.03 }
	);
});

test('Teacher table shows **no** scores', async ({ page }) => {
	await loginAsTeacher(page, 'mrs_thirdgrade');
	await page.locator('a:has-text("View Class Scores")').click();

	await page.waitForTimeout(1500);
	await expect(page.locator('div[id=scoreTable]')).toHaveScreenshot(
		'teacher-mrs-thirdgrade-empty-scoretable.png',
		{ maxDiffPixelRatio: 0.03 }
	);
});

test('Teacher table shows scores', async ({ page }) => {
	await loginAsTeacher(page, 'mitchinson');
	await page.locator('a:has-text("View Class Scores")').click();

	await page.waitForTimeout(1500);
	await expect(page.locator('div[id=scoreTable]')).toHaveScreenshot(
		'teacher-mitchinson-scores-scoretable.png',
		{ maxDiffPixelRatio: 0.03 }
	);
});
