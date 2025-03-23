import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import { addMinutes, addSeconds, differenceInSeconds } from 'date-fns';
import { timeToDrawAfterSubmittingQuiz } from '$lib/config';
import { getSignedCookieValue } from '$lib/signedCookie';
import { logEvent } from '../../../../lib/logging';

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

		const score = await db.checkIfScoreExistsForQuizAndStudent(accessCode, loginName);
		if (!score?.timeFinished) {
			bail();
		}

		const studentId = await getSignedCookieValue('studentId', cookies);
		let drawing = await db.getDrawing(studentId, accessCode);
		if (!drawing) {
			drawing = await db.startDrawing(studentId, accessCode);
			logEvent(loginName, `Started drawing image for quiz ${accessCode}`);
		}

		const drawingDueDate = addSeconds(drawing?.timeStarted, timeToDrawAfterSubmittingQuiz);
		const diffSeconds = differenceInSeconds(drawingDueDate, new Date());

		return {
			drawingAlreadyExistsBase64: drawing?.jpgBase64,
			secondsToDraw: diffSeconds,
			accessCode
		};
	});
};
