<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import ScoreChart from '$lib/components/ScoreChart/ScoreChart.svelte';
	import ScoreTable from '../../../lib/components/ScoreTable/ScoreTable.svelte';

	export let data;
	const signedInTeacherName = data.loginName;
	const signedInTeacherGrade = data.grade || '0';
</script>

<ScoreChart
	disableFilterControls={true}
	selectedTeacherName={signedInTeacherName}
	selectedGrade={signedInTeacherGrade}
/>

<ScoreTable lockedToTeacher={true} grade={signedInTeacherGrade} teacherName={signedInTeacherName} />
