<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import ScoreChart from '$lib/components/ScoreChart/ScoreChart.svelte';
	import GradeTeacherDropdown from '$lib/components/ScoreChart/GradeTeacherDropdown.svelte';

	export let data;
	const allTeachers = data.teachers;

	let selectedTeacherName = 'all';
	let selectedGrade = '1';
</script>

<GradeTeacherDropdown bind:selectedGrade bind:selectedTeacherName teacherOptions={allTeachers} />

<ScoreChart teacherName={selectedTeacherName} grade={selectedGrade} />

<Card additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center font-bold">Student Scores</h1>
</Card>
