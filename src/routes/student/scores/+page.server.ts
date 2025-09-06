import { getYearIntFromCookies, getSignedCookieValue } from '$lib/cookieAndAuthUtils';
import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import type { PageServerLoad } from './$types';

const db = new Database();

export const load: PageServerLoad = async ({ request, cookies }) => {
	return validateRole(request, cookies, ['Student'], async (_r, loginName) => {
		const year = await getYearIntFromCookies(cookies);

		const scores = await db.getScores({
			studentName: loginName,
			year: year
		});

		return {
			scores,
			studentName: loginName
		};
	});
};
