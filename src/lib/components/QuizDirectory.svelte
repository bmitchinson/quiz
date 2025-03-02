<script lang="ts">
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	import type { Quiz } from '@prisma/client';
	import Notification from './Notification.svelte';
	import { getReadableTitleOfQuiz } from '../dataUtils';
	import { invalidateAll } from '$app/navigation';
	import { gradesWithAll } from '$lib/components/RadioButtons';

	export let selectedGrade = '';

	export let allQuizzes: (Quiz & {
		_count: {
			scores: number;
		};
	})[];

	export let disableFilterControls = false;

	let quizDelMsg = '';
	let success = false;

	let currentPage = 1;
	const itemsPerPage = 5;

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	$: filteredQuizzes = allQuizzes
		.filter(({ grade }) => {
			if (!selectedGrade) return true;
			else return grade === parseInt(selectedGrade);
		})
		.sort((a, b) => getReadableTitleOfQuiz(a).localeCompare(getReadableTitleOfQuiz(b)));

	$: paginatedQuizzes = filteredQuizzes.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	$: totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);

	async function deleteQuiz(quiz: Quiz) {
		if (
			window.confirm(
				`Are you sure you want to delete the quiz: \n"${getReadableTitleOfQuiz(quiz)}"\n\n This will also delete all of it's scores.`
			)
		) {
			const formData = new FormData();
			formData.append('quizId', quiz.id.toString());

			const response = await fetch('?/deleteQuiz', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.status === 200) {
				quizDelMsg = 'Quiz deleted successfully';
				success = true;
				await invalidateAll();
			} else {
				quizDelMsg = 'Failed to delete quiz';
				success = false;
			}
		}
	}
</script>

<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
	<h1 class="text-2xl font-bold mb-4 text-center">Existing Quizzes</h1>
	{#if quizDelMsg}
		<Notification notifName="quiz-delete-status" errorMode={!success} message={quizDelMsg} />
	{/if}
	{#if !disableFilterControls}
		<div class="flex flex-col items-center mb-6">
			<p class="block text-gray-700 font-medium mb-2">Grade Filter</p>
			<RadioButtons
				name="grade-filter"
				options={gradesWithAll}
				bind:selectedOptionValue={selectedGrade}
			/>
		</div>
	{/if}
	<table class="min-w-full bg-white">
		<thead>
			<tr>
				<th class="py-2 px-4 border-b">Quiz</th>
				<th class="py-2 px-4 border-b">Access Code</th>
				<th class="py-2 px-4 border-b">Submissions</th>
				{#if !disableFilterControls}
					<th class="py-2 px-4 border-b">Actions</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#if paginatedQuizzes.length === 0}
				<tr>
					<td colspan={disableFilterControls ? 3 : 4} class="py-2 px-4 text-center">None</td>
				</tr>
			{/if}
			{#each paginatedQuizzes as quiz}
				<tr class="p-2">
					<td class="py-2 px-4 border-b m-2">
						<div class="flex justify-center">
							{getReadableTitleOfQuiz(quiz)}
						</div>
					</td>
					<td class="py-2 px-4 border-b m-2">
						<div class="flex justify-center" id={`accessCode-${getReadableTitleOfQuiz(quiz)}`}>
							{quiz.accessCode}
						</div>
					</td>
					<td class="py-2 px-4 border-b m-2">
						<div class="flex justify-center">{quiz._count.scores}</div>
					</td>
					{#if !disableFilterControls}
						<td class="flex justify-center items-center m-2 space-x-2">
							<a
								id={`edit-${getReadableTitleOfQuiz(quiz)}`}
								href={`/admin/editQuiz/${quiz.accessCode}`}
								class="bg-green-200 hover:bg-green-300 text-black font-semibold py-1 px-2 rounded-md transition duration-200"
							>
								Edit
							</a>
							<button
								id={`delete-${getReadableTitleOfQuiz(quiz)}`}
								on:click={() => deleteQuiz(quiz)}
								class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md transition duration-200"
							>
								Delete
							</button>
						</td>
					{/if}
				</tr>
			{/each}
		</tbody>
	</table>
	{#if paginatedQuizzes.length !== 0}
		<div class="flex justify-between mt-12">
			<button
				on:click={() => goToPage(currentPage - 1)}
				class="px-4 py-2 bg-gray-300 rounded-md"
				disabled={currentPage === 1}
			>
				Previous
			</button>
			<span>Page {currentPage} of {totalPages}</span>
			<button
				on:click={() => goToPage(currentPage + 1)}
				class="px-4 py-2 bg-gray-300 rounded-md"
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</div>
	{/if}
</div>
