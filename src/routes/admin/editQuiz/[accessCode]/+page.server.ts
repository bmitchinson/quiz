import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import { parseEnteredQuestionsIntoEvalAble } from '$lib/dataUtils';
import { logDBError, logEvent } from '$lib/logging';

const db = new Database();

export const load: PageServerLoad = async ({ params, request, cookies }) =>
	validateRole(request, cookies, ['Admin'], async (_r, loginName) => {
		const { accessCode } = params;
		try {
			const quiz = await db.getQuiz(accessCode);
			return { quiz, accessCode };
		} catch (err) {
			logDBError(loginName, `Failed to get quiz ${accessCode} on quizEdit`, err);
			throw error(500, `Failed to get quiz ${accessCode} for quiz edit`);
		}
	});

export const actions: Actions = {
	updateQuizQs: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Admin'], async (_r, loginName) => {
			const formData = await request.formData();
			const accessCode = formData.get('accessCode');
			let questionData = parseEnteredQuestionsIntoEvalAble(formData.get('questionData'));

			try {
				await db.updateQuizQuestions(accessCode, questionData);
				logEvent(loginName, `Updated quiz questions for ${accessCode}`);
				return { success: true, message: 'Quiz questions updated successfully' };
			} catch (err) {
				logDBError(loginName, `Failed to save quiz edits for ${accessCode}`, err);
				return { success: false, message: err.uiText ? err.uiText : 'Failed to update quiz' };
			}
		})
};
