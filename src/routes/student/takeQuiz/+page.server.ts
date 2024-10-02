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
			const check = await db.checkIfScoreExistsForQuizAndStudent(
				accessCode,
				cookies.get('validatedUsername')
			);
			if (check) {
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
	},
	postCompletedScore: async ({ request, cookies }) => {
		const data = await request.formData();

		const correctAnswers = parseInt(data.get('correctAnswers'));
		const timeStarted = new Date(data.get('timeStarted'));
		const timeFinished = new Date(data.get('timeFinished'));
		const studentName = cookies.get('validatedUsername');
		const quizCode = data.get('quizCode');

		return await db
			.addScore(correctAnswers, timeStarted, timeFinished, studentName, quizCode)
			.then(() => ({ success: true }))
			.catch((e) => ({ success: false }));
	}
};
