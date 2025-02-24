import { Database } from '$lib/database';
import { getSignedCookieValue } from '$lib/signedCookie';
import { validateRole } from '$lib/passwordUtils';
import { addMinutes } from 'date-fns';
import { quizHasTakenLongerThan5Minutes } from '../../../lib/dateUtils';

const db = new Database();

export const actions: Actions = {
	getQuiz: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Student'], async () => {
			const data = await request.formData();
			const accessCode = data.get('accessCode');

			// Validate access code and retrieve questions
			const quiz = await db.getQuiz(accessCode);
			if (quiz) {
				const existingScore = await db.checkIfScoreExistsForQuizAndStudent(
					accessCode,
					await getSignedCookieValue('loginName', cookies)
				);
				if (
					existingScore
					// &&
					// existingScore.correctAnswers !== existingScore.totalQuestions &&
					// !quizHasTakenLongerThan5Minutes(existingScore.timeStarted, existingScore.timeFinished)
				) {
					const message = 'You have already taken this quiz';
					return { success: false, message: "You've already taken this quiz :)" };
				} else {
					return { success: true, message: quiz.questionsData };
				}
			} else {
				return { success: false, message: 'Invalid Access Code' };
			}
		}),

	postQuestionAnswered: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Student'], async () => {
			const data = await request.formData();

			const correctAnswers = parseInt(data.get('correctAnswers'));
			const timeStarted = new Date(data.get('timeStarted'));
			const timeFinished = new Date(data.get('timeFinished'));
			const studentId = parseInt(await getSignedCookieValue('studentId', cookies));
			const quizCode = data.get('quizCode');
			const answers = data.get('answers').replaceAll(' ', '').split(',');

			if (quizHasTakenLongerThan5Minutes(timeStarted, timeFinished)) {
				return { success: false, message: 'Time Expired' };
			}

			return await db
				.updateOrCreateScore(
					correctAnswers,
					timeStarted,
					timeFinished,
					studentId,
					quizCode,
					answers
				)
				.then(() => ({ success: true }))
				.catch((e) => ({ success: false }));
		})
};
