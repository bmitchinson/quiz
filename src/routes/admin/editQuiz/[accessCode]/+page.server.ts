import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import { parseEnteredQuestionsIntoEvalAble } from '$lib/dataUtils';

const db = new Database();

export const load: PageServerLoad = async ({ params, request, cookies }) =>
	validateRole(request, cookies, 'Admin', async () => {
		const { accessCode } = params;
		try {
			const quiz = await db.getQuiz(accessCode);
			return { quiz, accessCode };
		} catch (err) {
			throw error(500, 'Failed to get quiz');
		}
	});

export const actions: Actions = {
	updateQuizQs: async ({ request, cookies }) =>
		validateRole(request, cookies, 'Admin', async () => {
			const formData = await request.formData();
			const accessCode = formData.get('accessCode');
			let questionData = parseEnteredQuestionsIntoEvalAble(formData.get('questionData'));

			try {
				await db.updateQuizQuestions(accessCode, questionData);
				return { success: true, message: 'Quiz questions updated successfully' };
			} catch (err) {
				console.error('Error updating quiz:', err);
				return { success: false, message: err.uiText ? err.uiText : 'Failed to update quiz' };
			}
		})
};
