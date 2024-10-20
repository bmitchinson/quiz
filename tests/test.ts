import { expect, test } from '@playwright/test';
import { resetStudentsAndTeachersToTestData, resetQuizzesToTestData } from './testutils';

const teacherQuizPrompt = 'Teacher: Manage Quizzes';
const teacherStudentPrompt = 'Teacher: Manage Students';
const studentPrompt = 'Student: Take a Quiz';

test.beforeEach(async ({ context }) => {
	await context.clearCookies();
});

const login = async (page) => {
	await page.locator(`input`).fill('admin');
	await page.locator(`button:has-text("Submit")`).click();
};

test('Home page has the right links', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator(`a:has-text("${teacherQuizPrompt}")`)).toBeVisible();
	await expect(page.locator(`a:has-text("${teacherStudentPrompt}")`)).toBeVisible();
	await expect(page.locator(`a:has-text("${studentPrompt}")`)).toBeVisible();
});

test('Manage students page is protected by password', async ({ page }) => {
	await page.goto('/admin/students');

	await expect(page.locator(`h1:has-text("Teacher Login")`)).toBeVisible();
});

test('Manage quizzes page is protected by password', async ({ page }) => {
	await page.goto('/admin/quizzes');

	await expect(page.locator(`h1:has-text("Teacher Login")`)).toBeVisible();
});

test('Invalid admin password shows message', async ({ page }) => {
	await page.goto('/admin/quizzes');

	await page.locator(`input`).fill('wrong-password');
	await page.locator(`button:has-text("Submit")`).click();

	await expect(page.getByText('Incorrect password')).toBeVisible();
});

test('Correct admin password goes to page', async ({ page }) => {
	await page.goto('/admin/quizzes');

	await page.locator(`input`).fill('admin');
	await page.locator(`button:has-text("Submit")`).click();

	await expect(page.locator(`h1:has-text("Quiz Management")`)).toBeVisible();
});

test.only('Students can be deleted', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await resetStudentsAndTeachersToTestData();
	await page.goto('/admin/students');
	await login(page);

	await expect(page.locator(`td:has-text("asmith")`)).toBeVisible();
	await page.locator(`button:has-text("Delete")`).first().click();
	await expect(page.locator(`td:has-text("asmith")`)).not.toBeVisible();
});

test('Quizzes can be deleted', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await resetQuizzesToTestData();
	await page.goto('/admin/quizzes');
	await login(page);

	await expect(page.locator(`td:has-text("Quiz 1")`)).toBeVisible();
	await expect(page.locator(`td:has-text("Quiz 2")`)).toBeVisible();
	await expect(page.locator(`td:has-text("Quiz 3")`)).toBeVisible();
	await page.locator(`button:has-text("Delete")`).first().click();
	await expect(page.locator(`td:has-text("Quiz 3")`)).not.toBeVisible();
});
