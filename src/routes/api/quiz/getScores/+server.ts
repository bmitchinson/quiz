import { Database } from '$lib/database';

const db = new Database();

export const POST = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Admin', 'Teacher'], async () => {
		const scores = await db.getScores();

		return json({ success: true, scores });
	});
