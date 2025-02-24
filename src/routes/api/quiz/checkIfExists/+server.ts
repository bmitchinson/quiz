import { json } from '@sveltejs/kit';
import { getSignedCookieValue } from '$lib/signedCookie';
import { Database } from '$lib/database';

const db = new Database();

export const POST = async ({ request, cookies }) => {
	const { year, grade, quarter, sequenceLetter } = (await request.json()) as {
		year: number;
		grade: number;
		quarter: number;
		sequenceLetter: string;
	};

	return db
		.getQuizByMetadata(2425, grade, quarter, sequenceLetter)
		.then((quiz) => json({ quizExists: !!quiz }));
};
