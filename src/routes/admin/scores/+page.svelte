<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import ScoreChart from '$lib/components/ScoreChart/ScoreChart.svelte';

	export let data;
	const allTeachers = data.teachers;
</script>

<ScoreChart teacherOptions={allTeachers} />

<Card additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center font-bold">Student Scores</h1>
</Card>
