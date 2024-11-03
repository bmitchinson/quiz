import test, { expect } from '@playwright/test';
import { clearAllDbEntries, getQuizzes, initializeTestQuizzes, loginAsAdmin } from './testutils';

test.beforeEach(async () => {
	await clearAllDbEntries();
});

test('Quizzes can be deleted', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await initializeTestQuizzes();
	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await expect(page.locator(`td:has-text("Quiz 1")`)).toBeVisible();
	await expect(page.locator(`td:has-text("Quiz 2")`)).toBeVisible();
	await expect(page.locator(`td:has-text("Quiz 3")`)).toBeVisible();
	await page.locator(`button:has-text("Delete")`).first().click();
	await expect(page.locator(`td:has-text("Quiz 3")`)).not.toBeVisible();
});

test('Old: Quizzes can be created', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await page.locator(`input[id="title"]`).fill('Playwright Quiz');
	await page.locator(`textarea[id="questionData"]`).fill('1+2\n3+4\n5+6');

	await page.locator(`button:has-text("Add Quiz")`).click();

	let quizzes = await getQuizzes();
	while (quizzes.length < 1) {
		await page.waitForTimeout(100);
		quizzes = await getQuizzes();
	}

	expect(quizzes.length).toBe(1);
	await expect(page.locator(`td:has-text("Playwright Quiz")`)).toBeVisible();
});
