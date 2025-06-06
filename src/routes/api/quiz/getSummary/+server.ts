import { json } from '@sveltejs/kit';
import { Database } from '$lib/database';
import type { QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
import { getReadableTitleOfQuiz } from '$lib/dataUtils.js';
import { validateRole } from '$lib/passwordUtils.js';

const db = new Database();

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

export const POST = async ({ request, cookies }) =>
	validateRole(request, cookies, ['Admin', 'Teacher'], async () => {
		const data = await request.json();
		const grade = parseInt(data.grade);
		const teacherName = data.teacherName;

		const summaryMapByAccessCode = await db.getSummaryOfScores(grade, teacherName);
		const quizzesByAccessCode = await db.getQuizzesByAccessCodes(
			Object.keys(summaryMapByAccessCode)
		);
		const allQuizzes = Object.values(quizzesByAccessCode);

		let dataExists = false;
		const dataForBarchart: QuizScoreSummaryDataPoint[] = getReadableQuizNamesForGrade(grade).map(
			(qReadableName) => {
				const quiz = allQuizzes.find((q) => getReadableTitleOfQuiz(q) === qReadableName);
				if (quiz) {
					dataExists = true;
					const quizSummary = summaryMapByAccessCode[quiz.accessCode];
					return {
						averageCorrectQuestions: Math.round(quizSummary._avg.correctAnswers * 100) / 100,
						// this is the value rendered as the chart data point, out of 100
						averageCorrectAsPercentage: Math.round(
							(quizSummary._avg.correctAnswers / quiz.totalQuestions) * 100
						),
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

		return json({ success: true, summary: dataForBarchart, dataExists });
	});
