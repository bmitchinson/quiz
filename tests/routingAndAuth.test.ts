import { expect, test } from '@playwright/test';
import { getCurrentYearInt, loginAsAdmin } from './testutils';

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

	test('year dropdown defaults to current year and persists navigation', async ({ page }) => {
		const currentYear = getCurrentYearInt().toString();

		await expect(page.locator('select#year-dropdown')).not.toBeVisible();
		await loginAsAdmin(page);
		await expect(page.locator('select#year-dropdown')).toHaveValue(currentYear);
		await page.locator('select#year-dropdown').selectOption('2425');
		await page.locator(`a:has-text("View Drawings")`).click();
		await expect(page.locator('select#year-dropdown')).toHaveValue('2425');
		await page.locator('select#year-dropdown').selectOption(currentYear);
		await page.locator(`a:has-text("Home")`).click();
		await expect(page.locator('select#year-dropdown')).toHaveValue(currentYear);
	});

	test('logging in as admin allows for managing quizzes', async ({ page }) => {
		await loginAsAdmin(page);
		await page.locator(`a:has-text("Manage Quizzes")`).click();
		await expect(page.locator(`h1:has-text("Create New Quiz")`)).toBeVisible();
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

	// TODO: sign in as student
});

test.describe('Teacher', () => {
	test('Teacher can login with all caps', async ({ page }) => {
		await page.goto('/login');
		await page.locator(`button:has-text("Teacher")`).click();
		await page.locator('input[id="teacherName"]').fill('MITCHINSON');
		await page.locator('input[id="teacherPassword"]').fill('teacher');
		await page.locator(`button:has-text("Submit")`).click();
		await expect(page).toHaveURL('/teacher');
	});

	test('Bad teacher password shows error', async ({ page }) => {
		await page.goto('/login');
		await page.locator(`button:has-text("Teacher")`).click();
		await page.locator('input[id="teacherName"]').fill('mitchinson');
		await page.locator('input[id="teacherPassword"]').fill('teacher---');
		await page.locator(`button:has-text("Submit")`).click();
		await expect(page).toHaveURL('/login');
		await expect(page.locator(`div[id="teacherLoginError"]`)).toHaveText('Invalid teacher login');
	});
});
