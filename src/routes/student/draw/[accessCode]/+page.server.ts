import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { addMinutes, addSeconds, differenceInSeconds } from 'date-fns';
import { timeToDrawAfterSubmittingQuiz } from '$lib/config';
import { getSignedCookieValue } from '$lib/signedCookie';

const db = new Database();

const bail = () => {
	throw redirect(302, '/student/takeQuiz');
};

export const load: PageServerLoad = async ({ params, request, cookies }) => {
	return validateRole(request, cookies, ['Student'], async (_r, loginName) => {
		const { accessCode } = params;
		if (!accessCode) {
			bail();
		}

		const studentId = await getSignedCookieValue('studentId', cookies);
		if (await db.getDrawing(studentId, accessCode)) {
			return { drawingAlreadyExists: true, secondsToDraw: null, accessCode };
		}

		const score = await db.checkIfScoreExistsForQuizAndStudent(accessCode, loginName);
		if (!score?.timeFinished) {
			bail();
		}

		const drawingDueDate = addSeconds(score!.timeFinished, timeToDrawAfterSubmittingQuiz);
		const now = new Date();
		const diffSeconds = differenceInSeconds(drawingDueDate, now);
		let secondsToDraw = null;

		if (diffSeconds > 60) {
			secondsToDraw = diffSeconds;
		} else if (diffSeconds > 0) {
			secondsToDraw = 60;
		}

		return { secondsToDraw, accessCode };
	});
};
