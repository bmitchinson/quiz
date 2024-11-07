<script lang="ts">
	import { getButtonStyles } from '$lib/cssUtils';
	import { grades } from '$lib/components/RadioButtons';
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	import Spinner from '$lib/components/Spinner.svelte';
	import { loadingSpinnerDelay } from '$lib/components/constants';

	let questionData = '';
	let questionDataErrMsg = '';
	let quizAlreadyExistsErrMsg = '';

	let currentStep = 1;
	let grade = '';
	let quarter = '';
	let sequenceLetter = '';
	let continueLoadingSpinner = false;

	$: {
		grade;
		quarter;
		sequenceLetter;
		quizAlreadyExistsErrMsg = '';
	}

	function continueToQuestionsOnClick() {
		continueLoadingSpinner = true;
		fetch('/api/quiz/checkIfExists', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				grade: parseInt(grade),
				quarter: parseInt(quarter),
				sequenceLetter
			})
		}).then((res) =>
			res.json().then(({ quizExists }) => {
				setTimeout(() => {
					if (quizExists) {
						quizAlreadyExistsErrMsg =
							'Quiz already exists for the selected grade, quarter, and test.';
						continueLoadingSpinner = false;
					} else {
						currentStep = 2;
						continueLoadingSpinner = false;
					}
				}, loadingSpinnerDelay);
			})
		);
	}

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
				questionDataErrMsg = 'Each line must contain at least one operator: (+, -, x, /)';
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
</script>

<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
	<form method="post" action="?/addQuiz" class="space-y-4">
		{#if currentStep === 1}
			<!-- NOTE: Grade, Quarter, Test Selection View -->
			<h1 class="text-2xl font-bold mb-6 text-center">Create Quiz</h1>
			<!-- Grade Selection -->
			<div>
				<label class="block text-gray-700 font-medium mb-2">Select Grade:</label>
				<RadioButtons name="grade" options={grades} bind:selectedOptionValue={grade} />
			</div>
			<!-- Quarter Selection -->
			<div>
				<label class="block text-gray-700 font-medium mb-2">Select Quarter:</label>
				<RadioButtons
					name="quarter"
					options={[
						{ t: '1st', v: '1' },
						{ t: '2nd', v: '2' },
						{ t: '3rd', v: '3' },
						{ t: '4th', v: '4' }
					]}
					bind:selectedOptionValue={quarter}
				/>
			</div>
			<!-- Test Selection -->
			<div>
				<label class="block text-gray-700 font-medium mb-2">Select Test:</label>
				<p class="block text-gray-700 mb-2">(A is 1st test of quarter, B is 2nd, etc)</p>
				<RadioButtons
					name="sequenceLetter"
					options={[
						{ t: 'A', v: 'A' },
						{ t: 'B', v: 'B' },
						{ t: 'C', v: 'C' },
						{ t: 'D', v: 'D' }
					]}
					bind:selectedOptionValue={sequenceLetter}
				/>
			</div>
			<!-- Add Questions Button -->
			<div class="flex justify-center">
				<button
					type="button"
					class={getButtonStyles(!(grade && quarter && sequenceLetter)) +
						'w-1/3 mt-4 flex flex-row justify-center'}
					on:click={continueToQuestionsOnClick}
					disabled={!(grade && quarter && sequenceLetter)}
				>
					{#if continueLoadingSpinner}
						<Spinner />
					{:else}
						Continue
					{/if}
				</button>
			</div>
			{#if quizAlreadyExistsErrMsg}
				<div class="text-red-500">
					{quizAlreadyExistsErrMsg}
				</div>
			{/if}
		{:else if currentStep === 2}
			<!-- NOTE: Questions View -->
			<!-- Hidden inputs to pass grade, quarter, and test to the backend -->
			<input type="hidden" name="grade" value={grade} />
			<input type="hidden" name="quarter" value={quarter} />
			<input type="hidden" name="sequenceLetter" value={sequenceLetter} />
			<!-- Display Selected Options -->
			<label for="questionData" class="block text-gray-700 font-medium mb-2">
				Enter questions for quiz: Grade {grade}, Quarter {quarter}, Test {sequenceLetter}
			</label>
			<!-- Error Message -->
			<p class:text-red-500={questionDataErrMsg}>
				{questionDataErrMsg
					? questionDataErrMsg
					: 'One math question per line, no "=" or letters. Just numbers, operators (+ - / x), and parentheses.'}
			</p>
			<!-- Questions Textarea -->
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
			<!-- Navigation Buttons -->
			<div class="flex justify-between">
				<button
					type="button"
					class="font-semibold py-2 px-4 rounded-md transition duration-200 bg-gray-500 hover:bg-gray-600 text-white"
					on:click={() => (currentStep = 1)}
				>
					Back
				</button>
				<button
					type="submit"
					class={getButtonStyles(!!questionDataErrMsg)}
					disabled={!!questionDataErrMsg}
				>
					Create Quiz
				</button>
			</div>
		{/if}
	</form>
</div>
