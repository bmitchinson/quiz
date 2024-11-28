<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeScoreDataPointChart } from '$lib/chart/chartutils';
	import type { QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
	import type { Chart, ChartTypeRegistry } from 'chart.js';
	import LoadingSquare from '../LoadingSquare.svelte';

	export let scoreData: QuizScoreSummaryDataPoint[];
	export let title: string;
	export let canvasId: string;
	export let loading = false;
	export let noData = false;
	let chartReference: Chart<keyof ChartTypeRegistry, QuizScoreSummaryDataPoint[], string>;

	onMount(() => {
		chartReference = initializeScoreDataPointChart(canvasId, scoreData);
	});

	$: {
		if (chartReference) {
			chartReference.data.datasets[0].data = scoreData;
			// @ts-ignore
			chartReference.options.scales.y.max = scoreData.reduce(
				(max, item) => (item.totalQuestions > max ? item.totalQuestions : max),
				0
			);
			chartReference.update();
		}
	}
</script>

<div class="relative">
	<h1 class="text-3xl text-center mb-4 font-bold">{title}</h1>
	<canvas class="w-full h-full" id={canvasId}></canvas>
	{#if noData && !loading}
		<div id="chartOverlay" class="absolute inset-0 flex items-center justify-center z-10 rounded">
			<div
				class="w-80 h-20 bg-white rounded-lg flex items-center justify-center border-2 border-black"
			>
				<p class="text-center text-gray-700 font-medium">No scores recorded</p>
			</div>
		</div>
	{/if}
	{#if loading}
		<LoadingSquare />
	{/if}
</div>
