import { Database } from '../../../lib/database';

const db = new Database();

export const load: LayoutServerLoad = async ({ cookies }) => ({
	validatedUsername: cookies.get('validatedUsername')
});

export const actions: Actions = {
	getQuiz: async ({ request }) => {
		const data = await request.formData();
		const accessCode = data.get('accessCode');

		// Validate access code and retrieve questions
		if (accessCode === '1234') {
			// todo: check that student hasn't already taken quiz, ref cookie
			const questionsData = '1 + 3333|12 / 6 / 2|(1 + 3) * 4';
			return { success: true, message: questionsData };
		} else {
			return { success: false, message: 'Invalid Access Code' };
		}
	},
	validateUsername: async ({ request, cookies }) => {
		const data = await request.formData();
		const usernameInput = data.get('usernameInput');
		console.log('validating', usernameInput);

		// Validate access code and retrieve questions
		if (await db.findStudentByName(usernameInput)) {
			cookies.set('validatedUsername', usernameInput, { path: '/', maxAge: 31_536_000 }); // 1 year
			return { success: true, message: usernameInput };
		} else {
			console.log(`Rejecting attempted username ${usernameInput}`);
			return { success: false, message: `Username "${usernameInput}" not found` };
		}
	}
};
