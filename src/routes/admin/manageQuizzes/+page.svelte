<script lang="ts">
	import QuizForm from '$lib/components/QuizForm.svelte';

	import { page } from '$app/stores';
	import Notification from '$lib/components/Notification.svelte';
	import QuizDirectory from '../../../lib/components/QuizDirectory.svelte';

	export let data;

	let showToast = true;
</script>

<svelte:head>
	<title>Admin: Manage Quizzes</title>
</svelte:head>

<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
	<form method="post" action="?/addQuiz" class="space-y-4">
		<!-- Display success message -->
		{#if $page.form?.success && showToast}
			<Notification notifName="quiz-create-success" message={'Quiz created successfully ✅'} />
		{/if}
		<QuizForm onContinueClick={() => (showToast = false)} editMode={false} />
	</form>
</div>

<QuizDirectory allQuizzes={data.quizzes} />
