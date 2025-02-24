import { Database, type GetScoresFilters } from '$lib/database';
import { validateRole } from '$lib/passwordUtils.js';
import { json } from '@sveltejs/kit';

const db = new Database();

// +server.ts
export const POST = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Admin', 'Teacher'], async () => {
		const { scoreId } = (await request.json()) as { scoreId: number };
		await db.deleteScore(scoreId);

		return json({ success: true });
	});
