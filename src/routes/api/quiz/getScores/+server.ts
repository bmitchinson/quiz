import { Database, type GetScoresFilters } from '$lib/database';
import { validateRole } from '$lib/passwordUtils.js';
import { json } from '@sveltejs/kit';

const db = new Database();

export const POST = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Admin', 'Teacher'], async () => {
		const filters = (await request.json()) as GetScoresFilters;
		const scores = await db.getScores(filters);

		return json({ success: true, scores });
	});
