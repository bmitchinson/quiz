import test, { expect } from '@playwright/test';
import {
	clearAllDbEntries,
	getQuizByMetadata,
	getQuizzes,
	resetQuizzesToTestData,
	loginAsAdmin
} from './testutils';

test.beforeEach(async () => {
	await resetQuizzesToTestData();
});

test('Quizzes can be deleted', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await expect(page.locator(`td:has-text("G1-Q1-A")`)).toBeVisible();
	await expect(page.locator(`td:has-text("G2-Q1-A")`)).toBeVisible();
	await expect(page.locator(`td:has-text("G3-Q1-A")`)).toBeVisible();
	await page.locator(`button:has-text("Delete")`).first().click();
	await expect(page.locator(`td:has-text("G3-Q1-A")`)).not.toBeVisible();
});

test("Quizzes can't be created if one already exists", async ({ page }) => {
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
	while (quizzes.length < 4) {
		await page.waitForTimeout(100);
		quizzes = await getQuizzes();
	}

	expect(quizzes.length).toBe(4);
	await expect(page.locator(`td:has-text("G4-Q4-A")`)).toBeVisible();
});

test('Quizzes can be edited', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	const accessCode = await page.locator(`div[id="accessCode-G1-Q1-A"]`).textContent();

	await page.locator(`a[id="edit-G1-Q1-A"]:has-text("Edit")`).click();
	await expect(page).toHaveURL(`/admin/editQuiz/${accessCode}`);
	const existingText = await page.locator(`textarea[id="questionData"]`).inputValue();
	expect(existingText).toBe('1+2\n3+4\n5+6');
	await page.locator(`textarea[id="questionData"]`).fill(existingText + '\n20x20');
	await page.locator(`button:has-text("Update Quiz Questions")`).click();
	await page
		.locator(`div[id="notif-quiz-edit-success"]:has-text("Quiz questions updated successfully ✅")`)
		.isVisible();

	// await new Promise((resolve) => setTimeout(resolve, 300));
	// const quiz = await getQuizByMetadata(1, 1, 'A');
	// expect(quiz.questionData).toBe('1+2|3+4|5+6|20*20');
});
