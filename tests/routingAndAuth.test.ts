import { expect, test } from '@playwright/test';
import {
	initializeTeachersData,
	resetQuizzesToTestData,
	loginAsAdmin,
	loginAsTeacher
} from './testutils';

test.beforeEach(async ({ context }) => {
	await context.clearCookies();
});

test('Home page has the right links', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator(`span:has-text("Admin")`)).toBeVisible();
	await expect(page.locator(`span:has-text("Teacher")`)).toBeVisible();
	await expect(page.locator(`span:has-text("Student")`)).toBeVisible();
});

test.describe('Admin', () => {
	test('admin/manageQuizzes page redirects to login', async ({ page }) => {
		await page.goto('/admin/manageQuizzes');
		await expect(page).toHaveURL('/login');
	});

	test('logging in as admin allows for managing quizzes', async ({ page }) => {
		await loginAsAdmin(page);
		await page.locator(`a:has-text("Manage Quizzes")`).click();
		await expect(page.locator(`h1:has-text("Create Quiz")`)).toBeVisible();
		await expect(page.locator(`h1:has-text("Existing Quizzes")`)).toBeVisible();
	});

	test('Invalid admin password shows message', async ({ page }) => {
		await page.goto('/login');

		await page.locator(`button:has-text("Admin")`).click();
		await page.locator(`input`).fill('wrong-password');
		await page.locator(`button:has-text("Submit")`).click();

		await expect(page.getByText('Invalid admin login')).toBeVisible();
	});
});

test.describe('Student', () => {
	test('student/takeQuiz page redirects to login', async ({ page }) => {
		await page.goto('/student/takeQuiz');
		await expect(page).toHaveURL('/login');
	});
});
