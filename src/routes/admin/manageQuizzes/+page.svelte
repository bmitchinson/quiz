<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import CreateQuiz from '$lib/components/CreateQuiz.svelte';

	export let data: {
		quizzes: {
			title: string;
			id: number;
			accessCode: string;
			associatedScores: number;
		}[];
	};

	let message = '';
	let success = false;
	let searchQuery = '';
	let currentPage = 1;
	const itemsPerPage = 5;

	// Computed property to get the filtered and paginated quizzes
	$: filteredQuizzes = data.quizzes.filter((quiz) =>
		quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
	);
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

	async function deleteQuiz({ title, id }: { title: string; id: number }) {
		if (
			window.confirm(
				`Are you sure you want to delete the quiz: \n"${title}"\n\n This will delete all of it's scores.`
			)
		) {
			const formData = new FormData();
			formData.append('quizId', id.toString());

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
	<h2 class="text-2xl font-bold mb-6 text-center">Existing Quizzes</h2>
	{#if message}
		<div
			class={`mb-4 p-4 rounded ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
		>
			{message}
		</div>
	{/if}
	<input
		type="text"
		placeholder="Search by title"
		bind:value={searchQuery}
		class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
	/>
	<table class="min-w-full bg-white">
		<thead>
			<tr>
				<th class="py-2 px-4 border-b">Title</th>
				<th class="py-2 px-4 border-b">Access Code</th>
				<th class="py-2 px-4 border-b">Submissions</th>
				<th class="py-2 px-4 border-b">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each paginatedQuizzes as quiz}
				<tr class="p-2">
					<td class="py-2 px-4 border-b m-2">
						<div class="flex justify-center">
							{quiz.title}
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
	<div class="flex justify-between mt-4">
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
</div>
