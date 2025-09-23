<script lang="ts">
	import type { GetScoresResult } from '$lib/database';
	import { getReadableTitleOfQuiz } from '$lib/dataUtils';
	import { calculateQuizScore } from '$lib/quizUtils';
	import Card from './Card.svelte';

	export let scores: GetScoresResult;
	export let studentName: string;
	export let teacherView: boolean;

	// Calculate scores for each quiz
	$: scoresWithCalculations = scores
		.map((score) => {
			const quizResults = calculateQuizScore(score.quiz.questionsData, score.answers);
			return {
				...score,
				quizName: getReadableTitleOfQuiz(score.quiz),
				percentage: quizResults.percentage,
				correctCount: quizResults.correctCount,
				totalQuestions: quizResults.totalQuestions
			};
		})
		.sort((a, b) => a.quizName.localeCompare(b.quizName));
</script>

<div class="min-h-screen flex justify-center items-start pt-8 px-4">
	<Card additionalClasses="w-full max-w-4xl">
		<!-- Header -->
		<div class="text-center">
			<div class="text-xl text-gray-600">
				<p class="font-semibold text-2xl text-gray-800">{studentName}</p>
				<p class="text-lg">Quiz Scores</p>
			</div>
		</div>

		{#if teacherView}
			<div class="mt-8 text-center">
				<a
					href="/teacher/manageStudents"
					class="inline-flex items-center text-[#26561b] hover:text-[#316f23] font-medium transition duration-200"
				>
					<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clip-rule="evenodd"
						></path>
					</svg>
					Back to Student List
				</a>
			</div>
		{:else}
			<div class="mt-8 text-center">
				<a
					href="/student"
					class="inline-flex items-center text-[#26561b] hover:text-[#316f23] font-medium transition duration-200"
				>
					<svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
							clip-rule="evenodd"
						></path>
					</svg>
					Back to Student Portal
				</a>
			</div>
		{/if}

		{#if scoresWithCalculations.length === 0}
			<!-- No scores message -->
			<div class="text-center py-12">
				<div class="text-gray-400">
					<svg class="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						></path>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-gray-900 mb-2">No Scores Yet</h3>
				<p class="text-gray-500 mb-6">You haven't taken any quizzes yet.</p>
				<a
					href="/student/takeQuiz"
					class="bg-[#26561b] hover:bg-[#316f23] text-white font-semibold py-2 px-4 rounded-md transition duration-200"
				>
					Take Your First Quiz
				</a>
			</div>
		{:else}
			<!-- Scores List -->
			<div class="flex flex-col gap-4">
				{#each scoresWithCalculations as score}
					<a
						href="/score/{score.id}"
						class="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-gray-300 transition-all duration-200 cursor-pointer"
					>
						<div class="flex items-center justify-between">
							<div class="flex-1">
								<h3 class="text-lg font-semibold text-gray-900 mb-2">
									{getReadableTitleOfQuiz(score.quiz)}
								</h3>
								<div class="flex items-center space-x-4 text-sm text-gray-600">
									<span>
										{score.correctCount}/{score.totalQuestions} correct
									</span>
									<span>•</span>
									<span>
										Taken {new Date(score.createdAt).toLocaleDateString()}
									</span>
								</div>
							</div>
							<div class="flex items-center space-x-4">
								<!-- Score percentage -->
								<div class="text-right">
									<div
										class="text-2xl font-bold {score.percentage >= 80
											? 'text-green-600'
											: score.percentage >= 60
												? 'text-yellow-600'
												: 'text-red-600'}"
									>
										{score.percentage}%
									</div>
									<div class="text-xs text-gray-500">Score</div>
								</div>
								<!-- Arrow icon -->
								<div class="text-gray-400">
									<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
										<path
											fill-rule="evenodd"
											d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
											clip-rule="evenodd"
										></path>
									</svg>
								</div>
							</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Summary Stats -->
			<div class="mt-8 p-6 bg-gray-50 rounded-lg">
				<h4 class="text-lg font-semibold text-gray-800 mb-4">Summary</h4>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
					<div>
						<div class="text-2xl font-bold text-blue-600">{scoresWithCalculations.length}</div>
						<div class="text-sm text-gray-600">Quizzes Taken</div>
					</div>
					<div>
						<div class="text-2xl font-bold text-green-600">
							{Math.round(
								scoresWithCalculations.reduce((acc, score) => acc + score.percentage, 0) /
									scoresWithCalculations.length
							)}%
						</div>
						<div class="text-sm text-gray-600">Average Score</div>
					</div>
				</div>
			</div>
		{/if}
	</Card>
</div>

<style>
	/* Additional responsive styling */
	/* gpt put this here and this should really be removed in favor of size boundary classes */
	@media (max-width: 768px) {
		.text-2xl {
			font-size: 1.5rem;
		}

		.text-lg {
			font-size: 1rem;
		}
	}
</style>
