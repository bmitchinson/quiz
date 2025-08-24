import test, { expect } from '@playwright/test';
import {
	loginAsTeacher,
	clearAllDbEntries,
	resetStudentsAndScores,
	initializeTestTeachers,
	amountOfStudentsForTeacher,
	resetQuizzesToTestData,
	addFourSecondGraderStudents,
	resetDrawingsToTestData
} from './testutils';

test.beforeEach(async () => {
	await clearAllDbEntries();
	await initializeTestTeachers();
});

test('Students can be deleted and searched', async ({ page }) => {
	page.on('dialog', (dialog) => dialog.accept());

	await addFourSecondGraderStudents();

	await loginAsTeacher(page);
	await page.locator('a:has-text("Manage Students")').click();
	await page.locator(`input[id="name-search"]`).fill('secondgrader');

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
	await loginAsTeacher(page);
	await page.locator('a:has-text("Manage Students")').click();

	await page.locator('textarea').fill('allison\nwilliam\nbenjamin\n32%\n  s43ara--\n\n');

	await page.locator('button:has-text("Add Students")').click();

	await expect(await amountOfStudentsForTeacher('mitchinson')).toBe(4);

	await expect(page.locator(`td:has-text("allison")`)).toBeVisible();
	await expect(page.locator(`td:has-text("william")`)).toBeVisible();
	await expect(page.locator(`td:has-text("benjamin")`)).toBeVisible();
	await expect(page.locator(`td:has-text("sara")`)).toBeVisible();
});

test('Students drawings can be viewed', async ({ page }) => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
	await resetDrawingsToTestData();

	await loginAsTeacher(page);

	await page.locator('a:has-text("View Student Drawings")').click();

	await expect(page.locator('div.drawing-card')).toHaveCount(6);
	await expect(page.locator('span#page-x-of-y')).toHaveText('Page 1 of 2 (8 drawings)');

	await page.locator(`button:has-text("next")`).click();

	await expect(page.locator('div.drawing-card')).toHaveCount(2);
});

test('Students drawings can be deleted', async ({ page }) => {
	await clearAllDbEntries();
	await initializeTestTeachers();
	await resetQuizzesToTestData();
	await resetStudentsAndScores();
	await resetDrawingsToTestData();

	await loginAsTeacher(page);

	await page.locator('a:has-text("View Student Drawings")').click();

	await expect(page.locator('div.drawing-card')).toHaveCount(6);
	await expect(page.locator('span#page-x-of-y')).toHaveText('Page 1 of 2 (8 drawings)');

	page.once('dialog', async (dialog) => {
		await dialog.accept();
	});
	await page.locator('button:has-text("Delete")').first().click();

	await expect(page.locator('span#total-drawings')).toHaveText('(7 drawings)');
});
