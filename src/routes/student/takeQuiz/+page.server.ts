import { Database } from '$lib/database';
import { getSignedCookieValue } from '$lib/signedCookie';
import { validateRole } from '$lib/passwordUtils';
import { addMinutes } from 'date-fns';
import { quizHasTakenLongerThanAllowed } from '$lib/dateUtils';
import { logAPIError, logEvent } from '$lib/logging';
import { getReadableTitleOfQuiz } from '$lib/dataUtils';
import type { PageServerLoad } from './$types';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Student'], async () => {
		try {
			const student = await db.getStudent(await getSignedCookieValue('loginName', cookies));
			return { studentGrade: student?.teacher.grade };
		} catch (err) {
			throw error(500, 'Failed to find student grade');
		}
	});

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
				if (!existingScore) {
					return { success: true, quiz: quiz };
				} else if (
					existingScore.answers.length !== quiz.totalQuestions &&
					!quizHasTakenLongerThanAllowed(existingScore.timeStarted)
				) {
					return { success: true, quiz: quiz, score: existingScore };
				} else if (
					existingScore.answers.length !== quiz.totalQuestions &&
					quizHasTakenLongerThanAllowed(existingScore.timeStarted)
				) {
					return {
						success: false,
						message: `Quiz not finished, but time expired.`
					};
				} else {
					return { success: false, message: "You've already taken this quiz :)" };
				}
			} else {
				return { success: false, message: 'Invalid Access Code' };
			}
		}),

	markQuizEndedEarly: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Student'], async (_r, loginName) => {
			const data = await request.formData();
			const studentId = parseInt(await getSignedCookieValue('studentId', cookies));
			const quizCode = data.get('quizCode');
			return await db.markQuizEndedEarly(quizCode, studentId).then(() => {
				logEvent(loginName, `Ended Quiz ${quizCode} Early due to distractions`);
				return { success: true };
			});
		}),

	postQuestionAnswered: async ({ request, cookies }) =>
		validateRole(request, cookies, ['Student'], async (_r, loginName) => {
			const data = await request.formData();

			const correctAnswers = parseInt(data.get('correctAnswers'));
			const timeStarted = new Date(data.get('timeStarted'));
			const timeFinished = new Date(data.get('timeFinished'));
			const studentId = parseInt(await getSignedCookieValue('studentId', cookies));
			const quizCode = data.get('quizCode');
			const answers = data.get('answers').replaceAll(' ', '').split(',');

			if (quizHasTakenLongerThanAllowed(timeStarted)) {
				return { success: false, message: 'Quiz Finished: Time Expired' };
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
				.then(({ quiz }) => {
					if (answers.length === 1) {
						logEvent(loginName, `Started Quiz ${quizCode} ${getReadableTitleOfQuiz(quiz)}`);
					} else if (answers.length === quiz.totalQuestions) {
						logEvent(loginName, `Finished Quiz ${quizCode} ${getReadableTitleOfQuiz(quiz)}`);
					}
					return { success: true };
				})
				.catch((err) => {
					logAPIError(loginName, 'Unable to submit answer', err);
					return { success: false };
				});
		})
};
