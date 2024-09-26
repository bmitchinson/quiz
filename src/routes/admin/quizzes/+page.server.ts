import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import { validatePasswordAndRefreshCookie } from '../../../lib/passwordcheck';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) =>
	validatePasswordAndRefreshCookie(request, cookies, async () => {
		try {
			const quizzes = await db.getAllQuizzes();
			return { quizzes };
		} catch (err) {
			throw error(500, 'Failed to load quizzes');
		}
	});

export const actions: Actions = {
	addQuiz: async ({ request, cookies }) =>
		validatePasswordAndRefreshCookie(request, cookies, async () => {
			const formData = await request.formData();
			const questionData = formData.get('questionData');
			const title = formData.get('title');

			try {
				await db.addQuiz(title, questionData);
				return { success: true, message: 'Quiz added successfully' };
			} catch (err) {
				return { success: false, message: 'Failed to add quiz' };
			}
		}),

	deleteQuiz: async ({ request, cookies }) =>
		validatePasswordAndRefreshCookie(request, cookies, async () => {
			const formData = await request.formData();
			const quizId = formData.get('quizId');

			try {
				await db.deleteQuiz(parseInt(quizId));
				return { success: true, message: 'Quiz deleted successfully' };
			} catch (err) {
				return { success: false, message: 'Failed to delete quiz' };
			}
		})
};
