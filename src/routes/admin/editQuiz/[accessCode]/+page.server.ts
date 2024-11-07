import { Database } from '$lib/database';
import { validateRole } from '$lib/passwordUtils';

const db = new Database();

export const load: PageServerLoad = async ({ params, request, cookies }) =>
	validateRole(request, cookies, 'Admin', async () => {
		const { accessCode } = params;
		try {
			const quiz = await db.getQuiz(accessCode);
			return { quiz, accessCode };
		} catch (err) {
			throw error(500, 'Failed to get quiz');
		}
	});
