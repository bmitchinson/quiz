<script>
	import QuizDirectory from '$lib/components/QuizDirectory.svelte';

	export let data;
</script>

<QuizDirectory
	disableFilterControls
	allQuizzes={data.quizzes}
	selectedGrade={data.gradeOfTeacher}
/>
