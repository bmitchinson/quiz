import test, { expect } from '@playwright/test';
import {
	loginAsTeacher,
	clearAllDbEntries,
	initializeTestStudents,
	initializeTestTeachers
} from './testutils';

test.beforeEach(async () => {
	await clearAllDbEntries();
});

test.describe('Teacher', () => {
	test('Students can be deleted', async ({ page }) => {
		page.on('dialog', (dialog) => dialog.accept());

		await initializeTestTeachers();
		await initializeTestStudents();

		await loginAsTeacher(page);
		await page.locator('a:has-text("Manage Students")').click();

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
		await initializeTestTeachers();

		await loginAsTeacher(page);
		// TODO:
		// await page.locator('a:has-text("Manage Students")').click();

		// await expect(page.locator(`td:has-text("secondgrader1")`)).toBeVisible();
		// await expect(page.locator(`td:has-text("secondgrader2")`)).toBeVisible();
		// await expect(page.locator(`td:has-text("secondgrader3")`)).toBeVisible();
		// await expect(page.locator(`td:has-text("secondgrader4")`)).toBeVisible();
		// await expect(page.locator('.student-row')).toHaveCount(4);
		// await page.locator(`button:has-text("Delete")`).nth(3).click();
		// await expect(page.locator(`td:has-text("secondgrader4")`)).not.toBeVisible();
		// await expect(page.locator('.student-row')).toHaveCount(3);
	});
});
