import { json } from '@sveltejs/kit';
import { getSignedCookieValue, getYearIntFromCookies } from '$lib/cookieAndAuthUtils';
import { Database } from '$lib/database';

const db = new Database();

export const POST = async ({ request, cookies }) => {
	const { year, grade, quarter, sequenceLetter } = (await request.json()) as {
		year: number;
		grade: number;
		quarter: number;
		sequenceLetter: string;
	};

	// TODO YEAR:
	return db
		.getQuizByMetadata(await getYearIntFromCookies(cookies), grade, quarter, sequenceLetter)
		.then((quiz) => json({ quizExists: !!quiz }));
};
