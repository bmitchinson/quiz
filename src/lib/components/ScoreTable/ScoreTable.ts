import { DataTable } from 'simple-datatables';
import type { GetScoresScore } from '../database';
import { getPercentageAsString } from '$lib/dataUtils';
import { format } from 'date-fns';
import { getButtonStyles } from '../../cssUtils';
import DeleteButton from './ScoreDeleteButton.svelte';
import { writable } from 'svelte/store';

export const scoreIdToDeleteStore = writable<{ scoreIdToDelete: number } | null>(null);

function renderDeleteButton(scoreId: number): string {
	const div = document.createElement('div');
	const btn = new DeleteButton({
		target: div,
		props: { scoreId }
	});

	return div.innerHTML;
}

export const createDataTable = (id: string, scoreData: GetScoresScore[]) => {
	const sortTableByLatestDate = [3, 'desc'];
	const dt = new DataTable(document.querySelector(`#${id}`) as HTMLTableElement, {
		perPageSelect: [5, 10, 15, ['All', -1]],
		data: {
			headings: [
				'Quiz Title (Quiz Code)',
				'Student',
				'Score',
				'Date',
				'Grade',
				'Teacher',
				'Action'
			],
			data: scoreData.map((i) => [
				`${i.quizTitle} (${i.quiz.accessCode})`,
				i.student.name,
				getPercentageAsString(i.correctAnswers, i.quiz.totalQuestions),
				format(new Date(i.createdAt), 'MMM do - h:mmaaa'),
				i.student.teacher.grade,
				i.student.teacher.name,
				renderDeleteButton(i.id)
			])
		},
		sortable: true,
		sortInitial: sortTableByLatestDate
	});

	document.querySelectorAll('.score-delete-btn').forEach((btn) => {
		btn.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			scoreIdToDeleteStore.set({ scoreIdToDelete: parseInt(target.getAttribute('scoreId')) });
		});
	});

	return dt;
};
