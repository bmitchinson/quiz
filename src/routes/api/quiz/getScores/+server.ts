import { getYearIntFromCookies } from '$lib/cookieAndAuthUtils';
import { Database, type GetScoresFilters } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';
import { json } from '@sveltejs/kit';

const db = new Database();

// +server.ts
export const POST = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Admin', 'Teacher'], async () => {
		const filters = (await request.json()) as GetScoresFilters;
		const year = await getYearIntFromCookies(cookies);
		const scores = await db.getScores({ ...filters, year });

		return json({ success: true, scores });
	});
