<script lang="ts">
	import ScoresList from '$lib/components/ScoresList.svelte';

	export let data;
</script>

<svelte:head>
	<title>{data.studentName}'s scores</title>
</svelte:head>

<ScoresList teacherView={true} studentName={data.studentName} scores={data.scores} />
