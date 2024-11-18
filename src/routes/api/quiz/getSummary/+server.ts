import { json } from '@sveltejs/kit';
import { Database } from '$lib/database';
import type { QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
import { getReadableTitleOfQuiz } from '../../../../lib/dataUtils.js';

const db = new Database();

// todo protect by teacher or admin (validate takes a list)

export const POST = async ({ request, cookies }) => {
	const data = await request.json();
	const grade = parseInt(data.grade);

	const summary = await db.getSummaryOfScores(grade);
	const quizCodes = summary.map((quizSummary) => quizSummary.quizCode);
	const quizzesByAccessCode = await db.getQuizzesByAccessCodes(quizCodes);

	const result: QuizScoreSummaryDataPoint[] = summary.map((quizSummary) => ({
		averageScore: Math.round(quizSummary._avg.correctAnswers * 100) / 100,
		submittedScores: quizSummary._count.id,
		quizName: getReadableTitleOfQuiz(quizzesByAccessCode[quizSummary.quizCode]),
		totalQuestions: quizzesByAccessCode[quizSummary.quizCode].totalQuestions
	}));

	const sortedByQuizName = result.sort((a, b) => a.quizName.localeCompare(b.quizName));

	return json({ success: true, summary: result });
};
