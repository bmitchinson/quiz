<script lang="ts">
	import ScoreChart from '$lib/components/ScoreChart/ScoreChart.svelte';
	import GradeTeacherDropdown from '$lib/components/ScoreChart/GradeTeacherDropdown.svelte';

	import ScoreTable from '$lib/components/ScoreTable.svelte';

	export let data;
	const allTeachers = data.teachers;

	let selectedTeacherName = 'all';
	let selectedGrade = '1';
</script>

<GradeTeacherDropdown bind:selectedGrade bind:selectedTeacherName teacherOptions={allTeachers} />

<ScoreChart teacherName={selectedTeacherName} grade={selectedGrade} />

<ScoreTable grade={selectedGrade} />
