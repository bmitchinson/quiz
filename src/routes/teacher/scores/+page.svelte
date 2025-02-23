<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import ScoreChart from '$lib/components/ScoreChart/ScoreChart.svelte';

	export let data;
	const signedInTeacherName = data.loginName;
	const signedInTeacherGrade = data.grade || '0';
</script>

<ScoreChart
	disableFilterControls={true}
	selectedTeacherName={signedInTeacherName}
	selectedGrade={signedInTeacherGrade}
/>

<Card additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center font-bold">Student Scores</h1>
</Card>
