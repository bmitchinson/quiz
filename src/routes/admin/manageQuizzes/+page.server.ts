import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/passwordUtils';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) =>
	validateRole(request, cookies, 'Admin', async () => {
		try {
			const quizzes = await db.getAllQuizzes();
			return { quizzes };
		} catch (err) {
			throw error(500, 'Failed to load quizzes');
		}
	});

export const actions: Actions = {
	addQuiz: async ({ request, cookies }) =>
		validateRole(request, cookies, 'Admin', async () => {
			const formData = await request.formData();
			const grade = parseInt(formData.get('grade'));
			const quarter = parseInt(formData.get('quarter'));
			const sequenceLetter = formData.get('sequenceLetter');
			const year = 2425;

			let questionData = formData.get('questionData');

			// Step 1: Remove all characters except numbers, operators (+, -, x, /), parentheses, and newlines
			questionData = questionData.replace(/[^\d+\-/x()\n]/g, '');
			// Step 2: Remove spaces and tabs
			questionData = questionData.replace(/[ \t]+/g, '');
			// Step 3: Replace multiple newlines with a single newline
			questionData = questionData.replace(/\n+/g, '\n');
			// Step 4: Ensure one space before and after each operator (+, -, x, /)
			questionData = questionData.replace(/\s*([+\-x/])\s*/g, ' $1 ');
			// Step 5: Replace existing newline characters with a | symbol
			questionData = questionData.replace(/\n/g, '|');
			// Step 6: Ensure there are no consecutive operators (+, -, x, /)
			questionData = questionData.replace(/([+\-x/])\s*([+\-x/])/g, '$1');

			try {
				await db.addQuiz({ grade, year, quarter, sequenceLetter }, questionData);
				return { success: true, message: 'Quiz added successfully' };
			} catch (err) {
				console.error('Error adding quiz:', err);
				return { success: false, message: err.uiText ? err.uiText : 'Failed to add quiz' };
			}
		}),

	deleteQuiz: async ({ request, cookies }) =>
		validateRole(request, cookies, 'Admin', async () => {
			const formData = await request.formData();
			const quizId = formData.get('quizId');

			try {
				await db.archiveQuiz(parseInt(quizId));
				return { success: true, message: 'Quiz deleted successfully' };
			} catch (err) {
				return { success: false, message: 'Failed to delete quiz' };
			}
		})
};
