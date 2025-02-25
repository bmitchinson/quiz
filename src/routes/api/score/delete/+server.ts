import { Database, type GetScoresFilters } from '$lib/database';
import { validateRole } from '$lib/passwordUtils.js';
import { json } from '@sveltejs/kit';
import { logDBError, logEvent } from '$lib/logging.js';

const db = new Database();

// +server.ts
export const POST = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Admin', 'Teacher'], async (_r, loginName) => {
		const { scoreId } = (await request.json()) as { scoreId: number };
		try {
			await db.deleteScore(scoreId);
			logEvent(loginName, `Deleted scoreId: ${scoreId}`);
		} catch (err) {
			logDBError(loginName, `Failed to delete scoreId: ${scoreId}`, err);
			throw err;
		}

		return json({ success: true });
	});
