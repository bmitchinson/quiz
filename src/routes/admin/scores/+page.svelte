<script lang="ts">
	import ScoreChart from '$lib/components/ScoreChart/ScoreChart.svelte';
	import ScoreTable from '$lib/components/ScoreTable/ScoreTable.svelte';

	export let data;
</script>

<ScoreChart allTeachers={data.teachers} />

<ScoreTable allTeachers={data.teachers} />
