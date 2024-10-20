import test, { expect } from '@playwright/test';
import { loginAsTeacher, resetStudentsAndTeachersToTestData } from './testutils';

test.describe('Teacher', () => {
	test('Students can be deleted', async ({ page }) => {
		page.on('dialog', (dialog) => dialog.accept());

		await resetStudentsAndTeachersToTestData();
		await loginAsTeacher(page);
		await page.locator('a:has-text("Manage Students")').click();

		await expect(page.locator(`td:has-text("secondgrader1")`)).toBeVisible();
		await expect(page.locator(`td:has-text("secondgrader2")`)).toBeVisible();
		await expect(page.locator(`td:has-text("secondgrader3")`)).toBeVisible();
		await expect(page.locator(`td:has-text("secondgrader4")`)).toBeVisible();
		await expect(page.locator('.student-row')).toHaveCount(4);
		await page.locator(`button:has-text("Delete")`).first().click();
		await expect(page.locator(`td:has-text("secondgrader1")`)).not.toBeVisible();
		await expect(page.locator('.student-row')).toHaveCount(3);
	});
});
