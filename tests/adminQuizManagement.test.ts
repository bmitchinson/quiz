import test, { expect } from '@playwright/test';
import { loginAsAdmin, resetQuizzesToTestData } from './testutils';

test('Quizzes can be deleted', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await resetQuizzesToTestData();
	await page.goto('/login');
	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await expect(page.locator(`td:has-text("Quiz 1")`)).toBeVisible();
	await expect(page.locator(`td:has-text("Quiz 2")`)).toBeVisible();
	await expect(page.locator(`td:has-text("Quiz 3")`)).toBeVisible();
	await page.locator(`button:has-text("Delete")`).first().click();
	await expect(page.locator(`td:has-text("Quiz 3")`)).not.toBeVisible();
});
