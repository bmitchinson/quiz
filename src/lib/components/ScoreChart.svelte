<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import { onMount } from 'svelte';
	import { initializeScoreDataPointChart } from '$lib/chart/chartutils';
	import type { ScoreDataPoint } from '../chart/scoreTooltip';

	export let scoreData: ScoreDataPoint[];
	export let title: string;
	export let canvasId: string;

	onMount(() => {
		initializeScoreDataPointChart(canvasId, scoreData);
	});
</script>

<Card additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center font-bold">{title}</h1>
	<canvas id={canvasId}></canvas>
</Card>
