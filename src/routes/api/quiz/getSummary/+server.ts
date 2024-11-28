import { json } from '@sveltejs/kit';
import { Database } from '$lib/database';
import type { QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
import { getReadableTitleOfQuiz } from '../../../../lib/dataUtils.js';

const db = new Database();

// todo protect by teacher or admin (validate takes a list)

const getReadableQuizNamesForGrade = (grade: number) => {
	return [
		`G${grade}-Q1-A`,
		`G${grade}-Q1-B`,
		`G${grade}-Q1-C`,
		`G${grade}-Q1-D`,
		`G${grade}-Q2-A`,
		`G${grade}-Q2-B`,
		`G${grade}-Q2-C`,
		`G${grade}-Q2-D`,
		`G${grade}-Q3-A`,
		`G${grade}-Q3-B`,
		`G${grade}-Q3-C`,
		`G${grade}-Q3-D`,
		`G${grade}-Q4-A`,
		`G${grade}-Q4-B`,
		`G${grade}-Q4-C`,
		`G${grade}-Q4-D`
	];
};

export const POST = async ({ request, cookies }) => {
	const data = await request.json();
	const grade = parseInt(data.grade);

	const summaryMapByAccessCode = await db.getSummaryOfScores(grade);
	const quizzesByAccessCode = await db.getQuizzesByAccessCodes(Object.keys(summaryMapByAccessCode));
	const allQuizzes = Object.values(quizzesByAccessCode);

	let dataExists = false;
	const result: QuizScoreSummaryDataPoint[] = getReadableQuizNamesForGrade(grade).map(
		(qReadableName) => {
			const quiz = allQuizzes.find((q) => getReadableTitleOfQuiz(q) === qReadableName);
			if (quiz) {
				dataExists = true;
				const quizSummary = summaryMapByAccessCode[quiz.accessCode];
				return {
					averageScore: Math.round(quizSummary._avg.correctAnswers * 100) / 100,
					submittedScores: quizSummary._count.id,
					quizName: qReadableName,
					totalQuestions: quiz.totalQuestions
				};
			} else {
				return {
					quizName: qReadableName
				};
			}
		}
	);

	return json({ success: true, summary: result, dataExists });
};
