import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/passwordUtils';
import { parseEnteredQuestionsIntoEvalAble } from '$lib/dataUtils';

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

			let questionData = parseEnteredQuestionsIntoEvalAble(formData.get('questionData'));

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
