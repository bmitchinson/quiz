<script lang="ts">
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

<ScoreTable {signedInTeacherName} grade={signedInTeacherGrade} />
