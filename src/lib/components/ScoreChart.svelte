<script lang="ts">
	import { onMount } from 'svelte';
	import { initializeScoreDataPointChart } from '$lib/chart/chartutils';
	import type { QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
	import type { Chart, ChartTypeRegistry } from 'chart.js';

	export let scoreData: QuizScoreSummaryDataPoint[];
	export let title: string;
	export let canvasId: string;
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

<div>
	<h1 class="text-3xl text-center mb-4 font-bold">{title}</h1>
	<canvas id={canvasId}></canvas>
</div>
