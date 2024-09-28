export const actions: Actions = {
	getQuiz: async ({ request }) => {
		const data = await request.formData();
		const accessCode = data.get('accessCode');

		// Validate access code and retrieve questions
		if (accessCode === '1234') {
			const questionsData = '1 + 3333|12 / 6 / 2|(1 + 3) * 4';
			return { success: true, message: questionsData };
		} else {
			return { success: false, message: 'Invalid Access Code' };
		}
	}
};
