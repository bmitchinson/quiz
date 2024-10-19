<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let data: {
		quizzes: {
			title: string;
			id: number;
			accessCode: string;
			associatedScores: number;
		}[];
	};

	let questionData = '';
	let questionDataErrMsg = '';

	function validateInput(event: InputEvent) {
		const target = event.target as HTMLTextAreaElement;
		let value = target.value;

		// Step 1: Remove all characters except numbers, operators (+, -, x, /), parentheses, and newlines
		value = value.replace(/[^\d+\-/x()\n]/g, '');

		// Step 2: Remove spaces and tabs
		value = value.replace(/[ \t]+/g, '');

		// Step 3: Replace multiple newlines with a single newline
		value = value.replace(/\n{2,}/g, '\n');

		// Step 4: Ensure one space before and after each operator (+, -, x, /)
		// (Optional: Uncomment if you want to format operators with spaces)
		// value = value.replace(/\s*([+\-x/])\s*/g, ' $1 ');

		// Step 5: Replace existing newline characters with a | symbol
		// (Optional: Uncomment if you want to replace newlines with a pipe)
		// value = value.replace(/\n/g, '|');

		// Update the textarea value if modifications were made in Steps 1-3
		target.value = value;

		// Allowed characters: digits, operators, newlines, spaces, and parentheses
		const allowedCharsRegex = /^[\d+\-x/()\n\s]*$/;
		if (!allowedCharsRegex.test(value)) {
			questionDataErrMsg =
				'Invalid characters. Only numbers, operators (+, -, x, /), and parentheses are allowed.';
			return;
		}

		// Split into lines and validate each line
		const lines = value.split('\n');
		const operatorRegex = /[+\-x/]/;

		for (const line of lines) {
			const trimmed = line.trim();
			if (trimmed === '') {
				questionDataErrMsg = 'Empty lines are not allowed.';
				return;
			}

			// Check for at least one operator
			if (!operatorRegex.test(trimmed)) {
				questionDataErrMsg = 'Each line must contain at least one operator.';
				return;
			}

			// Ensure operators are not at the start or end
			if (/^[+\-x/]/.test(trimmed) || /[+\-x/]$/.test(trimmed)) {
				questionDataErrMsg = 'Operators (+, -, x, /) cannot be at the start or end of a line.';
				return;
			}

			// Step 6: Ensure there are no consecutive operators (+, -, x, /)
			const consecutiveOperatorsRegex = /[+\-x/]{2,}/;
			if (consecutiveOperatorsRegex.test(trimmed)) {
				questionDataErrMsg = 'Consecutive operators (+, -, x, /) are not allowed.';
				return;
			}
		}

		// If all validations pass
		questionDataErrMsg = '';
		questionData = value;
	}

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
	<title>Quiz: Manage Quizzes</title>
</svelte:head>

<div class="bg-white bg-opacity-70 shadow-lg rounded-lg p-8 w-full max-w-lg">
	<h1 class="text-2xl font-bold mb-6 text-center">Quiz Management</h1>
	<form method="post" action="?/addQuiz" class="space-y-4">
		<div>
			<label for="title" class="block text-gray-700 font-medium mb-2"> Enter Quiz Title </label>
			<input
				id="title"
				name="title"
				class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
				placeholder="Week 5 - 4th Grade"
				required
				maxlength="30"
			/>
		</div>
		<label for="questionData" class="block text-gray-700 font-medium mb-2">
			Enter Quiz Questions
		</label>
		<p class:text-red-500={questionDataErrMsg}>
			{questionDataErrMsg
				? questionDataErrMsg
				: 'One math question per line, no "=" or letters. Just numbers, operators (+ - / x), and parenthesis.'}
		</p>
		<textarea
			id="questionData"
			name="questionData"
			rows="10"
			required
			class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 {questionDataErrMsg
				? 'border-red-500 focus:ring-red-500'
				: 'focus:ring-[#26561b]'}"
			placeholder="1+3
8/2
3+2"
			bind:value={questionData}
			on:input={validateInput}
		></textarea>
		<div class="flex justify-center">
			<button
				type="submit"
				class="font-semibold py-2 px-4 rounded-md transition duration-200 {questionDataErrMsg
					? 'bg-gray-400 text-gray-700 cursor-not-allowed'
					: 'bg-[#26561b] hover:bg-[#316f23] text-white'}"
				disabled={questionDataErrMsg}
			>
				Add Quiz
			</button>
		</div>
	</form>
</div>

<div class="bg-white bg-opacity-70 shadow-lg rounded-lg p-8 w-full max-w-xl">
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
