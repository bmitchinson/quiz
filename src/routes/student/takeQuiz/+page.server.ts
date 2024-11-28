import { Database } from '$lib/database';
import { getSignedCookieValue } from '$lib/signedCookie';
import { validateRole } from '$lib/passwordUtils';

const db = new Database();

export const actions: Actions = {
	getQuiz: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Student'], async () => {
			const data = await request.formData();
			const accessCode = data.get('accessCode');

			// Validate access code and retrieve questions
			const quiz = await db.getQuiz(accessCode);
			if (quiz) {
				const check = await db.checkIfScoreExistsForQuizAndStudent(
					accessCode,
					await getSignedCookieValue('loginName', cookies)
				);
				if (check) {
					return { success: false, message: "You've already taken this quiz :)" };
				} else {
					return { success: true, message: quiz.questionsData };
				}
			} else {
				return { success: false, message: 'Invalid Access Code' };
			}
		}),

	postCompletedScore: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Student'], async () => {
			const data = await request.formData();

			const correctAnswers = parseInt(data.get('correctAnswers'));
			const timeStarted = new Date(data.get('timeStarted'));
			const timeFinished = new Date(data.get('timeFinished'));
			const studentId = parseInt(await getSignedCookieValue('studentId', cookies));
			const quizCode = data.get('quizCode');

			return await db
				.addScore(correctAnswers, timeStarted, timeFinished, studentId, quizCode)
				.then(() => ({ success: true }))
				.catch((e) => ({ success: false }));
		})
};
