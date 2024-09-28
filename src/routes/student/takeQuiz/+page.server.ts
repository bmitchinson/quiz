import { Database } from '../../../lib/database';

const db = new Database();

export const load: LayoutServerLoad = async ({ cookies }) => ({
	validatedUsername: cookies.get('validatedUsername')
});

export const actions: Actions = {
	getQuiz: async ({ request, cookies }) => {
		const data = await request.formData();
		const accessCode = data.get('accessCode');

		// Validate access code and retrieve questions
		const quiz = await db.getQuiz(accessCode);
		if (quiz) {
			if (
				await db.checkIfScoreExistsForQuizAndStudent(accessCode, cookies.get('validatedUsername'))
			) {
				return { success: false, message: "You've already taken this quiz :)" };
			} else {
				return { success: true, message: quiz.questionsData };
			}
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
