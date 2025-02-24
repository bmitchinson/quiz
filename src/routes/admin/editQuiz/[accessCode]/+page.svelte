<script>
	import { page } from '$app/stores';
	import Notification from '$lib/components/Notification.svelte';
	import QuizForm from '$lib/components/QuizForm.svelte';
	import { getReadableTitleOfQuiz } from '$lib/dataUtils';

	export let data;
	const editableQuestionsData = data.quiz?.questionsData.replaceAll('|', '\n').replaceAll('*', 'x');
</script>

<svelte:head>
	{#if data?.quiz}
		<title>Quiz Edit: {getReadableTitleOfQuiz(data.quiz)}</title>
	{:else}
		<title>Quiz Not Found</title>
	{/if}
</svelte:head>

<div class="bg-white rounded-lg p-8 shadow-lg max-w-lg">
	{#if data?.quiz}
		<form method="post" action="?/updateQuizQs" class="space-y-4">
			{#if $page.form?.success}
				<Notification
					notifName="quiz-edit-success"
					message={'Quiz questions updated successfully ✅'}
				/>
			{/if}
			<QuizForm
				editMode
				accessCode={data.quiz.accessCode}
				questionData={editableQuestionsData}
				grade={data.quiz.grade.toString()}
				sequenceLetter={data.quiz.sequenceLetter}
				quarter={data.quiz.quarter.toString()}
			/>
		</form>
	{:else}
		<p>Quiz with access code {data.accessCode} does not exist for editing.</p>
	{/if}
</div>
