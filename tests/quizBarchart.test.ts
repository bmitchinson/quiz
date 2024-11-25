import test, { expect } from '@playwright/test';
import {
	clearAllDbEntries,
	initializeTestTeachers,
	loginAsAdmin,
	resetQuizzesToTestData,
	resetStudentsAndScores
} from './testutils';

test.beforeAll(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
});

test('Admin first grader table visual reg', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("View Scores")').click();

	// 1st grade
	await page.waitForTimeout(2500);
	await expect(page).toHaveScreenshot('firstgrade.png');
	await page.mouse.move(650, 400);
	await expect(page).toHaveScreenshot('firstgrade_tooltip.png');

	// 2nd grade
	await page.locator('div[id="grade-select-2"]').click();
	await page.waitForTimeout(1500);
	await page.mouse.move(650, 375);
	await expect(page).toHaveScreenshot('secondgrade_tooltip.png');
});
