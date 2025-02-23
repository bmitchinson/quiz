import { DataTable } from 'simple-datatables';
import type { GetScoresScore } from '../database';
import { getPercentageCorrect } from '$lib/dataUtils';
import { format } from 'date-fns';

export const createDataTable = (id: string, scoreData: GetScoresScore[]) =>
	new DataTable(document.querySelector(`#${id}`) as HTMLTableElement, {
		perPageSelect: [5, 10, 15, ['All', -1]],
		data: {
			headings: ['Quiz Title (Quiz Code)', 'Student', 'Score', 'Date', 'Grade', 'Teacher'],
			data: scoreData.map((i) => [
				`${i.quizTitle} (${i.quiz.accessCode})`,
				i.student.name,
				getPercentageCorrect(i.correctAnswers, i.quiz.totalQuestions),
				format(new Date(i.createdAt), 'MMM do - h:mmaaa'),
				i.student.teacher.grade,
				i.student.teacher.name
			])
		},
		sortable: true,
		sortInitial: [3, 'desc']
	});
