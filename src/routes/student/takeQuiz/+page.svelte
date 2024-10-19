<script lang="ts">
	import { deserialize } from '$app/forms';

	// Import actions and data from the server
	export let data;

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
	let usernameInput = '';
	let usernameError = null;
	let validatedUsername = data.validatedUsername ? data.validatedUsername : '';

	let timeStarted = null;
	let timeFinished = null;

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
				timeStarted = new Date();
			} else {
				accessCodeErr = result.data.message;
				questionsData = '';
			}
		}
	}

	async function validateUsername() {
		const formData = new FormData();
		formData.append('usernameInput', usernameInput.toLowerCase());
		const response = await fetch('?/validateUsername', {
			method: 'POST',
			body: formData
		});
		const result = deserialize(await response.text());
		if (result.data.success === true) {
			location.reload();
		} else {
			validatedUsername = '';
			usernameError = result.data.message;
		}
	}

	// Function to evaluate the expression
	function evaluateExpression(expression) {
		try {
			// Remove any unwanted characters (whitelist numbers, operators, parentheses)
			const safeExpression = expression.replace(/[^-()\d/x+.\s]/g, '');
			// Replace X with * for evaluating multiplication
			const safeExpressionWithFixedMultiplication = safeExpression.replace(/x/g, '*');
			// Evaluate the expression
			// eslint-disable-next-line no-new-func
			return Function(`'use strict'; return (${safeExpressionWithFixedMultiplication})`)();
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

	function postCompletedScore() {
		console.log('posting score');
		const formData = new FormData();
		formData.append('correctAnswers', results.filter((r) => r.correct).length);
		formData.append('timeStarted', timeStarted);
		formData.append('timeFinished', timeFinished);
		formData.append('quizCode', accessCode);

		fetch('?/postCompletedScore', {
			method: 'POST',
			body: formData
		}).then(() => {
			console.log('score posted ✅');
		});
	}

	// Function to handle answer submission
	function submitAnswer() {
		if (userAnswer) {
			// Check if user's answer matches the correct answer
			if (parseFloat(userAnswer) === correctAnswer) {
				isCorrect = true;
				results.push({ question: questions[currentQuestionIndex], correct: true });
			} else {
				isCorrect = false;
				results.push({ question: questions[currentQuestionIndex], correct: false });
			}
		}
		if (currentQuestionIndex === questions.length - 1) {
			timeFinished = new Date();
			postCompletedScore();
		}
	}

	function goToNextQuestion() {
		isCorrect = null;
		userAnswer = '';
		currentQuestionIndex++;
	}

	function showDivisionSymbols(question: String): String {
		return question.replace(/\//g, '÷');
	}
</script>

{#if !validatedUsername}
	<div class="bg-white rounded-lg p-8 shadow-md text-center max-w-xl mx-auto mt-10">
		<h2 class="text-2xl mb-4">Enter Username</h2>
		<p>It's your first initial followed by your last name:</p>
		<p>Example: wmitchinson</p>
		<form class="flex flex-col items-center">
			<input
				data-1p-ignore
				type="text"
				name="usernameInput"
				class="border-2 border-gray-300 rounded-md p-2 text-2xl w-64 text-center my-4"
				required
				bind:value={usernameInput}
			/>
			{#if usernameError}
				<p class="text-red-500 mb-2">{usernameError}</p>
			{/if}
			<button
				on:click={validateUsername}
				class="bg-[#26561b] text-white px-4 py-2 rounded-md mt-2"
				type="submit"
			>
				Start
			</button>
		</form>
	</div>
{:else if !quizStarted}
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
				class="bg-[#26561b] text-white px-4 py-2 rounded-md mt-4"
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
		<div
			class="flex gap-7 text-8xl font-serif mb-4"
			style="font-family: 'Times New Roman', Times, serif;"
		>
			{showDivisionSymbols(questions[currentQuestionIndex])} =
			<input
				type="number"
				class="border-2 border-gray-300 rounded-md p-2 text-4xl w-32 text-center pb-4"
				disabled={isCorrect !== null}
				required
				bind:value={userAnswer}
			/>
		</div>
		{#if isCorrect === null}
			<button
				class="{`${userAnswer ? 'bg-[#26561b]' : 'bg-gray-500 cursor-not-allowed opacity-50'}`} text-white px-4 py-2 rounded-md mt-4"
				disabled={!userAnswer}
				on:click={submitAnswer}
			>
				Submit
			</button>
		{:else}
			<button class="bg-[#26561b] text-white px-4 py-2 rounded-md mt-4" on:click={goToNextQuestion}>
				Next Question
			</button>
		{/if}
		{#if isCorrect !== null && !isCorrect}
			<p class="text-2xl mt-4">Correct answer: {correctAnswer}</p>
		{:else if isCorrect}
			<p class="text-2xl mt-4">Correct!</p>
		{/if}
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

<style>
	/* Chrome, Safari, Edge, Opera */
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
