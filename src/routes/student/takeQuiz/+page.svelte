<script lang="ts">
	import { deserialize } from '$app/forms';
	import type { Quiz, Score } from '@prisma/client';
	import { onMount } from 'svelte';
	import Card from '$lib/components/Card.svelte';
	import { allowedDistractionsBeforeQuizEnds, disallowDistractionsFeatureFlag } from '$lib/config';
	import { getButtonStyles } from '$lib/cssUtils';

	export let data;
	const studentGrade = data.studentGrade;

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

	let timeStarted = null;

	let focusLossDetectedCount = 0;
	let showFocusWarning = false;
	let quizEndedEarly = false;

	$: {
		showFocusWarning = focusLossDetectedCount > 0;
	}

	$: {
		if (
			disallowDistractionsFeatureFlag &&
			focusLossDetectedCount > allowedDistractionsBeforeQuizEnds
		) {
			!quizEndedEarly &&
				currentQuestionIndex < questions.length - 1 &&
				markQuizEndedEarly().then(() => {
					quizEndedEarly = true;
				});
		}
	}

	let submissionDisabled = true;

	$: {
		submissionDisabled = userAnswer === '' || userAnswer === null;
	}

	async function markQuizEndedEarly() {
		const formData = new FormData();
		formData.append('quizCode', accessCode);
		return fetch('?/markQuizEndedEarly', {
			method: 'POST',
			body: formData
		});
	}

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
				const quiz = result.data.quiz as Quiz;

				if (quiz.grade != studentGrade) {
					accessCodeErr = 'This quiz is not for your grade level.';
					return;
				}

				questionsData = quiz.questionsData;
				questions = questionsData.split('|');
				quizStarted = true;
				accessCodeErr = '';
				timeStarted = new Date();

				// if this is resuming an existing attempt
				if (result.data.score) {
					const score = result.data.score as Score;
					if (score.quizEndedEarly && disallowDistractionsFeatureFlag) {
						quizEndedEarly = true;
					}
					currentQuestionIndex = score.answers.length;
					results = score.answers.map((answer, i) => {
						const wasCorrect = parseInt(answer) === evaluateExpression(questions[i]);
						return {
							question: questions[i],
							correct: wasCorrect,
							answer: parseInt(answer)
						};
					});
					timeStarted = score.timeStarted;
				}
			} else {
				accessCodeErr = result.data.message;
				questionsData = '';
			}
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

	function postQuestionAnswered() {
		const formData = new FormData();
		formData.append('correctAnswers', results.filter((r) => r.correct).length);
		formData.append('timeStarted', timeStarted);
		formData.append('timeFinished', new Date());
		formData.append('quizCode', accessCode);
		formData.append(
			'answers',
			results.map((r) => r.answer)
		);

		return fetch('?/postQuestionAnswered', {
			method: 'POST',
			body: formData
		}).then(async (response) => {
			const result = deserialize(await response.text());
			if (!result.data.success) {
				accessCodeErr = result.data.message;
				questionsData = '';
				let currentQuestionIndex = 0;
				let questions = [];
				let results = [];
				quizStarted = false;
			}
		});
	}

	// Function to handle answer submission
	function submitAnswer() {
		if (!submissionDisabled) {
			// Check if user's answer matches the correct answer
			isCorrect = parseFloat(userAnswer) === correctAnswer;
			results.push({
				question: questions[currentQuestionIndex],
				correct: isCorrect,
				answer: parseFloat(userAnswer)
			});
			showFocusWarning = false;
			postQuestionAnswered();
		}
	}

	function goToNextQuestion() {
		showFocusWarning = false;
		isCorrect = null;
		userAnswer = '';
		currentQuestionIndex++;
	}

	function showReadableOpSymbols(question: String): String {
		return question.replace(/\//g, '÷').replace('*', 'x');
	}

	onMount(() => {
		document.addEventListener('visibilitychange', () => {
			quizStarted && focusLossDetectedCount++;
		});
		window.addEventListener('blur', () => quizStarted && focusLossDetectedCount++);
	});
</script>

<svelte:head>
	<title>Student: Take Quiz</title>
</svelte:head>

{#if quizEndedEarly}
	<Card colMode additionalClasses="items-center">
		<p class="text-center text-2xl">Quiz ended early due to too many distractions.</p>
		<p class="text-center text-2xl">Your teacher can delete your quiz score to issue a retake.</p>
		<div class="mw-8">
			<button on:click={() => location.reload()} class={getButtonStyles()}> Back </button>
		</div>
	</Card>
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
	<div class="flex flex-col items-center gap-8">
		<div
			class="rounded-lg p-8 shadow-md text-center mx-auto mt-10
      {isCorrect === null ? 'bg-white' : ''}
      {isCorrect === true ? 'bg-green-200' : ''}
      {isCorrect === false ? 'bg-red-200' : ''}"
		>
			<div
				class="flex gap-7 text-6xl font-serif mb-4"
				style="font-family: 'Times New Roman', Times, serif;"
				id="displayedQuestion"
			>
				{showReadableOpSymbols(questions[currentQuestionIndex])} =
				<input
					id="userAnswer"
					type="number"
					class="border-2 border-gray-300 rounded-md p-2 text-4xl w-32 text-center pb-4"
					disabled={isCorrect !== null}
					required
					bind:value={userAnswer}
				/>
			</div>
			{#if isCorrect === null}
				<button
					class="{`${submissionDisabled ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-[#26561b]'}`} text-white px-4 py-2 rounded-md mt-4"
					disabled={submissionDisabled}
					on:click={submitAnswer}
				>
					Submit
				</button>
			{:else}
				<button
					class="bg-[#26561b] text-white px-4 py-2 rounded-md mt-4"
					on:click={goToNextQuestion}
				>
					Next Question
				</button>
			{/if}
			{#if isCorrect !== null && !isCorrect}
				<p id="result-msg" class="text-2xl mt-4">Correct answer: {correctAnswer}</p>
			{:else if isCorrect}
				<p id="result-msg" class="text-2xl mt-4">Correct!</p>
			{/if}
		</div>
		{#if showFocusWarning}
			<Card>
				<p class="text-center text-2xl">Warning: Loss of focus detected.</p>
				<p class="text-center text-2xl">
					Please avoid other tasks until the quiz is complete, you got this!
				</p>
			</Card>
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
