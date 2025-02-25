import type { Actions, PageServerLoad } from './$types';
import { Database } from '$lib/database';
import { error } from '@sveltejs/kit';
import { validateRole } from '$lib/passwordUtils';
import { parseEnteredQuestionsIntoEvalAble } from '$lib/dataUtils';
import { logDBError, logEvent } from '$lib/logging';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Admin'], async () => {
		try {
			const quizzes = await db.getAllQuizzes();
			return { quizzes };
		} catch (err) {
			throw error(500, 'Failed to load quizzes');
		}
	});

export const actions: Actions = {
	addQuiz: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Admin'], async (_r, loginName) => {
			const formData = await request.formData();
			const grade = parseInt(formData.get('grade'));
			const quarter = parseInt(formData.get('quarter'));
			const sequenceLetter = formData.get('sequenceLetter');
			const year = 2425;

			let questionData = parseEnteredQuestionsIntoEvalAble(formData.get('questionData'));

			try {
				await db.addQuiz({ grade, year, quarter, sequenceLetter }, questionData);
				logEvent(
					loginName,
					`Added quiz for grade ${grade} quarter ${quarter} sequence ${sequenceLetter}`
				);
				return { success: true, message: 'Quiz added successfully' };
			} catch (err) {
				logDBError(loginName, `Failed to add quiz`, err);
				return { success: false, message: err.uiText ? err.uiText : 'Failed to add quiz' };
			}
		}),

	deleteQuiz: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Admin'], async (_r, loginName) => {
			const formData = await request.formData();
			const quizId = formData.get('quizId');

			try {
				await db.archiveQuiz(parseInt(quizId));
				logEvent(loginName, `Deleted quiz ${quizId}`);
				return { success: true, message: 'Quiz deleted successfully' };
			} catch (err) {
				logDBError(loginName, `Failed to delete quiz ${quizId}`, err);
				return { success: false, message: 'Failed to delete quiz' };
			}
		})
};
