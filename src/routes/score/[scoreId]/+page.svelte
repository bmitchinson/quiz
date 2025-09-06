<script lang="ts">
	import { getReadableTitleOfQuiz } from '$lib/dataUtils';

	export let data;
</script>

<svelte:head>
	<title>Score: {data.score.student.name} - {getReadableTitleOfQuiz(data.score.quiz)}</title>
</svelte:head>

<p>
	<!-- Test: 1+3|4/4|9-0|5x5 -->
	Test: {data.score.quiz.questionsData}

	<!-- 4,1 -->
	Answers: {data.score.answers}
</p>
