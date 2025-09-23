import { DataTable } from 'simple-datatables';
import { getPercentageAsString } from '$lib/dataUtils';
import { format } from 'date-fns';
import DeleteButton from './ScoreDeleteButton.svelte';
import ViewButton from './ScoreViewButton.svelte';
import { writable } from 'svelte/store';

export const scoreIdToDeleteStore = writable<{ scoreIdToDelete: number } | null>(null);

function renderActionButtons(scoreId: number): string {
	const actionsContainer = document.createElement('div');
	actionsContainer.style.display = 'flex';
	actionsContainer.style.flexDirection = 'row';
	actionsContainer.style.flexWrap = 'wrap';
	actionsContainer.style.gap = '4px';

	const buttonContainer1 = document.createElement('div');
	new ViewButton({
		target: buttonContainer1,
		props: { scoreId }
	});

	const buttonContainer2 = document.createElement('div');
	new DeleteButton({
		target: buttonContainer2,
		props: { scoreId }
	});

	actionsContainer.appendChild(buttonContainer1);
	actionsContainer.appendChild(buttonContainer2);
	return actionsContainer.innerHTML;
}

export const createDataTable = (id: string, scoreData: Object[]) => {
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
				renderActionButtons(i.id)
			])
		},
		sortable: true,
		sortInitial: sortTableByLatestDate
	});

	document.querySelectorAll('.score-view-btn').forEach((btn) => {
		btn.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			const scoreId = parseInt(target.getAttribute('scoreId'));
			window.location.href = `/score/${scoreId}`;
		});
	});

	document.querySelectorAll('.score-delete-btn').forEach((btn) => {
		btn.addEventListener('click', (event) => {
			const target = event.target as HTMLElement;
			const scoreId = parseInt(target.getAttribute('scoreId'));

			// Find the table row to get student and quiz info
			const row = target.closest('tr');
			if (row) {
				const cells = row.querySelectorAll('td');
				const quizTitle = cells[0]?.textContent?.split(' (')[0] || 'Unknown Quiz';
				const studentName = cells[1]?.textContent || 'Unknown Student';

				const confirmed = confirm(
					`Are you sure you'd like to delete ${studentName}'s ${quizTitle} score?`
				);
				if (confirmed) {
					scoreIdToDeleteStore.set({ scoreIdToDelete: scoreId });
				}
			}
		});
	});

	return dt;
};
