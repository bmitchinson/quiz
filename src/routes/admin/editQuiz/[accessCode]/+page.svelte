<script>
	import { getReadableTitleOfQuiz } from '$lib/dataUtils';

	export let data;
</script>

<svelte:head>
	{#if data?.quiz}
		<title>Quiz Edit: {getReadableTitleOfQuiz(data.quiz)}</title>
	{:else}
		<title>Quiz Not Found</title>
	{/if}
</svelte:head>

<div class="bg-white rounded-lg p-8 shadow-lg">
	{#if data?.quiz}
		<p>Editing Quiz: {getReadableTitleOfQuiz(data.quiz)}</p>
	{:else}
		<p>Quiz with access code {data.accessCode} does not exist for editing.</p>
	{/if}
</div>
