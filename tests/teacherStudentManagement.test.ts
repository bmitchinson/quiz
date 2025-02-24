import test, { expect } from '@playwright/test';
import {
	loginAsTeacher,
	clearAllDbEntries,
	resetStudentsAndScores,
	initializeTestTeachers,
	amountOfStudentsForTeacher,
	resetQuizzesToTestData,
	addFourSecondGraderStudents
} from './testutils';

test.beforeEach(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
});

test('Students can be deleted and searched', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await addFourSecondGraderStudents();

	await loginAsTeacher(page);
	await page.locator('a:has-text("Manage Students")').click();
	await page.locator(`input[id="name-search"]`).fill('secondgrader');

	await expect(page.locator(`td:has-text("secondgrader1")`)).toBeVisible();
	await expect(page.locator(`td:has-text("secondgrader2")`)).toBeVisible();
	await expect(page.locator(`td:has-text("secondgrader3")`)).toBeVisible();
	await expect(page.locator(`td:has-text("secondgrader4")`)).toBeVisible();
	await expect(page.locator('.student-row')).toHaveCount(4);
	await page.locator(`button:has-text("Delete")`).nth(3).click();
	await expect(page.locator(`td:has-text("secondgrader4")`)).not.toBeVisible();
	await expect(page.locator('.student-row')).toHaveCount(3);
});

test('Students can be added', async ({ page }) => {
	await loginAsTeacher(page);
	await page.locator('a:has-text("Manage Students")').click();

	await page.locator('textarea').fill('allison\nwilliam\nbenjamin\n32%\n  s43ara--\n\n');

	await page.locator('button:has-text("Add Students")').click();

	await expect(await amountOfStudentsForTeacher('mitchinson')).toBe(4);

	await expect(page.locator(`td:has-text("allison")`)).toBeVisible();
	await expect(page.locator(`td:has-text("william")`)).toBeVisible();
	await expect(page.locator(`td:has-text("benjamin")`)).toBeVisible();
	await expect(page.locator(`td:has-text("sara")`)).toBeVisible();
});
