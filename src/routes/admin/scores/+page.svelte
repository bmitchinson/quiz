<script lang="ts">
	import Card from '$lib/components/Card.svelte';
	import {
		Chart,
		BarController,
		BarElement,
		Legend,
		CategoryScale,
		LinearScale,
		Tooltip
	} from 'chart.js';
	import { onMount } from 'svelte';
	import { externalTooltip, type ScoreDataPoint } from '$lib/scoreTooltip';

	Chart.register(BarController, BarElement, Legend, CategoryScale, LinearScale, Tooltip);

	const sampleData: ScoreDataPoint[] = [
		{ averageScore: 8.3, quizName: 'Q1-A', submittedScores: 18 },
		{ averageScore: 9.7, quizName: 'Q1-B', submittedScores: 20 },
		{ averageScore: 10, quizName: 'Q1-C', submittedScores: 22 },
		{ averageScore: 10, quizName: 'Q1-D', submittedScores: 21 },
		{ averageScore: 8.1, quizName: 'Q2-A', submittedScores: 19 },
		{ averageScore: 9.4, quizName: 'Q2-B', submittedScores: 23 },
		{ averageScore: 10, quizName: 'Q2-C', submittedScores: 17 },
		{ averageScore: 10, quizName: 'Q2-D', submittedScores: 16 },
		{ averageScore: 8.2, quizName: 'Q3-A', submittedScores: 15 },
		{ averageScore: 9.8, quizName: 'Q3-B', submittedScores: 22 },
		{ averageScore: 10, quizName: 'Q3-C', submittedScores: 21 },
		{ averageScore: 10, quizName: 'Q3-D', submittedScores: 20 },
		{ averageScore: 8.4, quizName: 'Q4-A', submittedScores: 18 },
		{ averageScore: 9.1, quizName: 'Q4-B', submittedScores: 19 },
		{ averageScore: 10, quizName: 'Q4-C', submittedScores: 23 },
		{ averageScore: 10, quizName: 'Q4-D', submittedScores: 17 }
	];

	onMount(() => {
		Tooltip.positioners.cursor = function (chartElements, coordinates) {
			return coordinates;
		};

		new Chart(document.getElementById('chartContainer'), {
			type: 'bar',
			options: {
				aspectRatio: 3,
				animation: true,
				plugins: {
					legend: {
						display: false
					},
					tooltip: {
						enabled: false,
						position: 'cursor',
						external: externalTooltip
					}
				},
				parsing: {
					xAxisKey: 'quizName',
					yAxisKey: 'averageScore'
				}
			},
			data: {
				labels: sampleData.map((r) => r.quizName),
				datasets: [
					{
						borderColor: '#26561b',
						backgroundColor: '#26561b',
						data: sampleData,
						borderRadius: 5,
						maxBarThickness: 50
					}
				]
			}
		});
	});
</script>

<Card additionalClasses={'w-5/6'}>
	<h1 class="text-3xl mb-8 text-center font-bold">Grade 1: Scores</h1>
	<canvas id="chartContainer"></canvas>
</Card>
