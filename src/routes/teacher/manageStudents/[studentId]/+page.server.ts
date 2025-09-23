import { getYearIntFromCookies } from '$lib/cookieAndAuthUtils';
import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import type { PageServerLoad } from './$types';

const db = new Database();

export const load: PageServerLoad = async ({ params, request, cookies }) => {
	return validateRole(request, cookies, ['Admin', 'Teacher', 'Student'], async (_r, loginName) => {
		const { studentId } = params;
		const activeYear = await getYearIntFromCookies(cookies);
		const student = await db.getStudent({ studentId: parseInt(studentId) }, activeYear);
		const scores = await db.getScores({ studentName: student?.name, year: activeYear });
		return { studentName: student?.name, scores };
	});
};
