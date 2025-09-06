<script lang="ts">
	import { getReadableTitleOfQuiz } from '$lib/dataUtils';
	import { calculateQuizScore } from '$lib/quizUtils';
	import Card from '$lib/components/Card.svelte';

	export let data;

	// Calculate quiz results
	$: quizResults = calculateQuizScore(data.score.quiz.questionsData, data.score.answers);
</script>

<svelte:head>
	<title>Score: {data.score.student.name} - {getReadableTitleOfQuiz(data.score.quiz)}</title>
</svelte:head>

<div class="min-h-screen flex justify-center items-start pt-8 px-4">
	<Card additionalClasses="w-full max-w-4xl">
		<!-- Header -->
		<div class="text-center mb-8">
			<div class="text-xl text-gray-600 mb-4">
				<p class="font-semibold">{data.score.student.name}</p>
				<p>{getReadableTitleOfQuiz(data.score.quiz)}</p>
			</div>

			<!-- Overall Score -->
			<div
				class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200"
			>
				<div class="flex justify-center items-center gap-8">
					<div class="text-center">
						<div class="text-3xl font-bold text-blue-600">
							{quizResults.correctCount}/{quizResults.totalQuestions}
						</div>
						<div class="text-sm text-gray-600">Questions Correct</div>
					</div>
					<div class="text-center">
						<div class="text-3xl font-bold text-blue-600">
							{quizResults.percentage}%
						</div>
						<div class="text-sm text-gray-600">Overall Score</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Questions Table -->
		<div class="overflow-x-auto">
			<table class="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
				<thead class="bg-gray-50">
					<tr>
						<th
							class="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
						>
							Question #
						</th>
						<th
							class="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b border-gray-200"
						>
							Problem
						</th>
						<th
							class="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200"
						>
							Answer
						</th>
						<th
							class="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200"
						>
							Correct Answer
						</th>
						<th
							class="px-6 py-4 text-center text-sm font-semibold text-gray-700 border-b border-gray-200"
						>
							Result
						</th>
					</tr>
				</thead>
				<tbody>
					{#each quizResults.results as result, index}
						<tr class="hover:bg-gray-50 transition-colors duration-150">
							<td class="px-6 py-4 text-sm font-medium text-gray-900 border-b border-gray-100">
								{index + 1}
							</td>
							<td class="px-6 py-4 text-sm text-gray-900 border-b border-gray-100">
								<code class="bg-gray-100 px-2 py-1 rounded text-lg font-mono">
									{result.question}
								</code>
							</td>
							<td class="px-6 py-4 text-center border-b border-gray-100">
								{#if result.studentAnswer === null || result.studentAnswer === undefined}
									<span class="text-lg font-semibold text-gray-400">—</span>
								{:else}
									<span
										class="text-lg font-semibold {result.isCorrect
											? 'text-green-600'
											: 'text-red-600'}"
									>
										{result.studentAnswer}
									</span>
								{/if}
							</td>
							<td class="px-6 py-4 text-center border-b border-gray-100">
								<span class="text-lg font-semibold text-blue-600">
									{result.correctAnswer}
								</span>
							</td>
							<td class="px-6 py-4 text-center border-b border-gray-100">
								{#if result.studentAnswer === null || result.studentAnswer === undefined}
									<div
										class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600"
									>
										<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
												clip-rule="evenodd"
											></path>
										</svg>
										Unanswered
									</div>
								{:else if result.isCorrect}
									<div
										class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
									>
										<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clip-rule="evenodd"
											></path>
										</svg>
										Correct
									</div>
								{:else}
									<div
										class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800"
									>
										<svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
											<path
												fill-rule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clip-rule="evenodd"
											></path>
										</svg>
										Incorrect
									</div>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Summary Footer -->
		<div class="mt-8 p-6 bg-gray-50 rounded-lg">
			<div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
				<div>
					<div class="text-2xl font-bold text-green-600">{quizResults.correctCount}</div>
					<div class="text-sm text-gray-600">Correct</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-red-600">
						{quizResults.results.filter(
							(r) => r.studentAnswer !== null && r.studentAnswer !== undefined && !r.isCorrect
						).length}
					</div>
					<div class="text-sm text-gray-600">Incorrect</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-gray-500">
						{quizResults.results.filter(
							(r) => r.studentAnswer === null || r.studentAnswer === undefined
						).length}
					</div>
					<div class="text-sm text-gray-600">Unanswered</div>
				</div>
				<div>
					<div class="text-2xl font-bold text-blue-600">{quizResults.totalQuestions}</div>
					<div class="text-sm text-gray-600">Total Questions</div>
				</div>
			</div>
		</div>
	</Card>
</div>

<style>
	/* Additional responsive styling */
	@media (max-width: 768px) {
		table {
			font-size: 0.875rem;
		}

		th,
		td {
			padding: 0.75rem 0.5rem;
		}

		.text-3xl {
			font-size: 1.875rem;
		}

		.text-xl {
			font-size: 1.125rem;
		}
	}
</style>
