import test, { expect } from '@playwright/test';
import {
	getQuizByMetadata,
	getQuizzes,
	resetQuizzesToTestData,
	loginAsAdmin,
	clearAllDbEntries,
	initializeTestTeachers,
	resetStudentsAndScores,
	resetDrawingsToTestData
} from './testutils';

test.beforeAll(async () => {
	await resetQuizzesToTestData();
});

test('Quizzes can be deleted', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();
	await page.locator("div[id='grade-filter-select-3']").click();

	await expect(page.locator(`td:has-text("G3-Q1-A")`)).toBeVisible();
	await page.locator(`button[id='delete-G3-Q1-A']:has-text("Delete")`).click();
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
	const amountOfQuizzesBeforeOneIsMade = (await getQuizzes()).length;

	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await page.locator('div[id="grade-select-4"]').click();
	await page.locator('div[id="quarter-select-4"]').click();
	await page.locator('div[id="sequenceLetter-select-A"]').click();
	await page.locator(`button:has-text("Continue")`).click();

	await page.locator(`textarea[id="questionData"]`).fill('1+2\n3+4\n5+6');

	await page.locator(`button:has-text("Create Quiz")`).click();

	while ((await getQuizzes()).length == amountOfQuizzesBeforeOneIsMade) {
		await page.waitForTimeout(100);
	}

	expect((await getQuizzes()).length).toBe(amountOfQuizzesBeforeOneIsMade + 1);

	await page.locator("div[id='grade-filter-select-4']").click();
	await expect(page.locator(`td:has-text("G4-Q4-A")`)).toBeVisible();
});

test('Quizzes can be edited', async ({ page }) => {
	await loginAsAdmin(page);
	await page.locator('a:has-text("Manage Quizzes")').click();

	await page.locator("div[id='grade-filter-select-3']").click();
	const accessCode = await page.locator(`div[id="accessCode-G3-Q1-B"]`).textContent();

	await page.locator(`a[id="edit-G3-Q1-B"]:has-text("Edit")`).click();
	await expect(page).toHaveURL(`/admin/editQuiz/${accessCode}`);
	const existingText = await page.locator(`textarea[id="questionData"]`).inputValue();
	expect(existingText).toBe('1+2\n3+4\n5+6');
	await page.locator(`textarea[id="questionData"]`).fill(existingText + '\n20x20');
	await page.locator(`button:has-text("Update Quiz Questions")`).click();
	await page
		.locator(`div[id="notif-quiz-edit-success"]:has-text("Quiz questions updated successfully ✅")`)
		.isVisible();

	await page.waitForTimeout(100);
	const quiz = await getQuizByMetadata({ grade: 3, quarter: 1, sequenceLetter: 'B', year: 2425 });
	expect(quiz.questionsData).toBe('1 + 2|3 + 4|5 + 6|20 x 20');
	expect(quiz?.totalQuestions).toBe(4);
});

test('Students drawings can be viewed', async ({ page }) => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
	await resetDrawingsToTestData();

	await loginAsAdmin(page);

	await page.locator('a:has-text("View Drawings")').click();

	await expect(page.locator('div.drawing-card')).toHaveCount(6);
	await expect(page.locator('span#page-x-of-y')).toHaveText('Page 1 of 2 (12 drawings)');

	await page.locator(`button:has-text("next")`).click();

	await expect(page.locator('div.drawing-card')).toHaveCount(6);
});

test('Students drawings can be deleted', async ({ page }) => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
	await resetDrawingsToTestData();

	await loginAsAdmin(page);

	await page.locator('a:has-text("View Drawings")').click();

	await expect(page.locator('div.drawing-card')).toHaveCount(6);
	await expect(page.locator('span#page-x-of-y')).toHaveText('Page 1 of 2 (12 drawings)');

	page.once('dialog', async (dialog) => {
		await dialog.accept();
	});
	await page.locator('button:has-text("Delete")').first().click();

	await expect(page.locator('span#total-drawings')).toHaveText('(11 drawings)');
});
