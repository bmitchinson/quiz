import { Database } from '$lib/database';
import { getSignedCookieValue } from '$lib/signedCookie';
import { validateRole } from '$lib/passwordUtils';
import type { PageServerLoad } from './$types';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Teacher'], async () => {
		try {
			const quizzes = await db.getAllQuizzes();
			const teacher = await db.getTeacher(await getSignedCookieValue('loginName', cookies));
			return { quizzes, gradeOfTeacher: teacher?.grade.toString() };
		} catch (err) {
			throw error(500, 'Failed to load quizzes / teacher grade');
		}
	});
