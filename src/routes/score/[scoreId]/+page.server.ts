import { getYearIntFromCookies } from '$lib/cookieAndAuthUtils';
import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import type { PageServerLoad } from './$types';

const db = new Database();

export const load: PageServerLoad = async ({ params, request, cookies }) => {
	return validateRole(request, cookies, ['Admin', 'Teacher', 'Student'], async (_r, loginName) => {
		const { scoreId } = params;

		const scores = await db.getScores({
			id: parseInt(scoreId),
			year: await getYearIntFromCookies(cookies)
		});

		return { score: scores[0] };
	});
};
