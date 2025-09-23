<script lang="ts">
	import ScoresList from '$lib/components/ScoresList.svelte';

	export let data;
</script>

<svelte:head>
	<title>My Scores - {data.studentName}</title>
</svelte:head>

<ScoresList teacherView={false} studentName={data.studentName} scores={data.scores} />
