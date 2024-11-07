<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { getReadableTitleOfQuiz } from '$lib/dataUtils';
	import type { Quiz } from '@prisma/client';
	import CreateQuiz from './CreateQuiz.svelte';
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	import { gradesWithAll } from '$lib/components/RadioButtons';

	export let data;

	let message = '';
	let success = false;
	let searchQuery = '';
	let currentPage = 1;
	const itemsPerPage = 5;

	let selectedGrade = '';

	$: filteredQuizzes = data.quizzes.filter(({ grade }) => {
		if (!selectedGrade) return true;
		else return grade === parseInt(selectedGrade);
	});

	$: paginatedQuizzes = filteredQuizzes.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil(filteredQuizzes.length / itemsPerPage);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

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
				message = 'Quiz deleted successfully';
				success = true;
				await invalidateAll();
			} else {
				message = 'Failed to delete quiz';
				success = false;
			}
		}
	}
</script>

<svelte:head>
	<title>Admin: Manage Quizzes</title>
</svelte:head>

<CreateQuiz />
<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl">
	<h1 class="text-2xl font-bold mb-4 text-center">Existing Quizzes</h1>
	{#if message}
		<div
			class={`mb-4 p-4 rounded ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
		>
			{message}
		</div>
	{/if}
	<div class="flex flex-col items-center mb-6">
		<p class="block text-gray-700 font-medium mb-2">Grade Filter</p>
		<RadioButtons name="grade" options={gradesWithAll} bind:selectedOptionValue={selectedGrade} />
	</div>
	<table class="min-w-full bg-white">
		<thead>
			<tr>
				<th class="py-2 px-4 border-b">Quiz</th>
				<th class="py-2 px-4 border-b">Access Code</th>
				<th class="py-2 px-4 border-b">Submissions</th>
				<th class="py-2 px-4 border-b">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#if paginatedQuizzes.length === 0}
				<tr>
					<td colspan="4" class="py-2 px-4 text-center">None</td>
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
						<div class="flex justify-center">
							{quiz.accessCode}
						</div>
					</td>
					<td class="py-2 px-4 border-b m-2">
						<div class="flex justify-center">{quiz.associatedScores}</div>
					</td>
					<td class="flex justify-center m-2">
						<button
							on:click={() => deleteQuiz(quiz)}
							class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md transition duration-200"
						>
							Delete
						</button>
					</td>
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
