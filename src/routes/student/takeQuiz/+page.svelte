<script lang="ts">
	import { deserialize } from '$app/forms';

	// Import actions and data from the server
	export let data;
	export let form;

	// State variables
	let accessCode = '';
	let accessCodeErr = '';
	let quizStarted = false;
	let questionsData = '';
	let questions = [];
	let currentQuestionIndex = 0;
	let userAnswer = '';
	let results = [];
	let isCorrect = null;
	let correctAnswer = null;

	async function getQuiz() {
		if (accessCode) {
			const formData = new FormData();
			formData.append('accessCode', accessCode);

			const response = await fetch('?/getQuiz', {
				method: 'POST',
				body: formData
			});

			const result = deserialize(await response.text());
			if (result.data.success === true) {
				questionsData = result.data.message;
				accessCodeErr = '';
			} else {
				accessCodeErr = 'Invalid Access Code';
				questionsData = '';
			}
		}
	}

	// Function to evaluate the expression
	function evaluateExpression(expression) {
		try {
			// Remove any unwanted characters (whitelist numbers, operators, parentheses)
			const safeExpression = expression.replace(/[^-()\d/*+.\s]/g, '');
			// Evaluate the expression
			// eslint-disable-next-line no-new-func
			return Function(`'use strict'; return (${safeExpression})`)();
		} catch (e) {
			console.error('Error evaluating expression:', e);
			return null;
		}
	}

	// Reactive statement to update correctAnswer whenever currentQuestionIndex changes
	$: if (quizStarted && currentQuestionIndex < questions.length) {
		correctAnswer = evaluateExpression(questions[currentQuestionIndex]);
	}

	// Start the quiz if questionsData is available
	$: if (questionsData && !quizStarted) {
		questions = questionsData.split('|');
		quizStarted = true;
	}

	// Function to handle answer submission
	function submitAnswer() {
		if (userAnswer) {
			// Check if user's answer matches the correct answer
			if (parseFloat(userAnswer) === correctAnswer) {
				console.log('correct');
				isCorrect = true;
				results.push({ question: questions[currentQuestionIndex], correct: true });
			} else {
				isCorrect = false;
				results.push({ question: questions[currentQuestionIndex], correct: false });
			}
			// Move to the next question after a short delay
			setTimeout(() => {
				isCorrect = null;
				userAnswer = '';
				currentQuestionIndex++;
			}, 1000); // 1-second delay
		}
	}
</script>

{#if !quizStarted}
	<!-- Show the access code form -->
	<div class="bg-white rounded-lg p-8 shadow-md text-center max-w-xl mx-auto mt-10">
		<h2 class="text-4xl mb-4">Enter Quiz Access Code</h2>
		<form class="flex flex-col items-center">
			<input
				type="text"
				name="accessCode"
				class="border-2 border-gray-300 rounded-md p-2 text-2xl w-64 text-center mb-4"
				maxlength="6"
				required
				bind:value={accessCode}
			/>
			{#if accessCodeErr}
				<p class="text-red-500">{accessCodeErr}</p>
			{/if}
			<button
				on:click={getQuiz}
				class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4"
				type="submit"
			>
				Start Quiz
			</button>
		</form>
	</div>
{:else if currentQuestionIndex < questions.length}
	<!-- Show the quiz question -->
	<div
		class="rounded-lg p-8 shadow-md text-center max-w-xl mx-auto mt-10
      {isCorrect === null ? 'bg-white' : ''}
      {isCorrect === true ? 'bg-green-200' : ''}
      {isCorrect === false ? 'bg-red-200' : ''}"
	>
		<div class="text-8xl font-serif mb-4" style="font-family: 'Times New Roman', Times, serif;">
			{questions[currentQuestionIndex]} =
			<input
				type="text"
				class="border-2 border-gray-300 rounded-md p-2 text-4xl w-32 text-center"
				bind:value={userAnswer}
			/>
		</div>
		<button class="bg-blue-500 text-white px-4 py-2 rounded-md mt-4" on:click={submitAnswer}>
			Submit
		</button>
	</div>
{:else}
	<!-- Show the score -->
	<div class="bg-white rounded-lg p-8 shadow-md text-center max-w-xl mx-auto mt-10">
		<h2 class="text-4xl mb-4">Quiz Complete!</h2>
		<p class="text-2xl">
			You got {results.filter((r) => r.correct).length} out of {questions.length} correct.
		</p>
	</div>
{/if}
