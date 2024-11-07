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

	await expect(page.locator(`td:has-text("G1-Q1-A")`)).toBeVisible();
	await expect(page.locator(`td:has-text("G2-Q1-A")`)).toBeVisible();
	await expect(page.locator(`td:has-text("G3-Q1-A")`)).toBeVisible();
	await page.locator(`button:has-text("Delete")`).first().click();
	await expect(page.locator(`td:has-text("G3-Q1-A")`)).not.toBeVisible();
});

test("Quizzes can't be created if one already exists", async ({ page }) => {
	await initializeTestQuizzes();

	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await page.locator('div[id="grade-select-1"]').click();
	await page.locator('div[id="quarter-select-1"]').click();
	await page.locator('div[id="sequenceLetter-select-A"]').click();
	await page.locator(`button:has-text("Continue")`).click();

	await expect(page.locator(`div[id="quiz-exists-err"]`)).toBeVisible();
});

test('Quizzes can be created', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await page.locator('div[id="grade-select-4"]').click();
	await page.locator('div[id="quarter-select-4"]').click();
	await page.locator('div[id="sequenceLetter-select-A"]').click();
	await page.locator(`button:has-text("Continue")`).click();

	await page.locator(`textarea[id="questionData"]`).fill('1+2\n3+4\n5+6');

	await page.locator(`button:has-text("Create Quiz")`).click();

	let quizzes = await getQuizzes();
	while (quizzes.length < 1) {
		await page.waitForTimeout(100);
		quizzes = await getQuizzes();
	}

	expect(quizzes.length).toBe(1);
	await expect(page.locator(`td:has-text("G4-Q4-A")`)).toBeVisible();
});
