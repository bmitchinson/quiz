<script lang="ts">
	import { type QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
	import Card from '$lib/components/Card.svelte';
	import { onMount } from 'svelte';
	import ScoreChartGraph from '$lib/components/ScoreChart/ScoreChartGraph.svelte';
	import { makePostRequest } from '../../apiUtils';

	export let grade = '1';
	export let teacherName = 'all';

	let scoreData: QuizScoreSummaryDataPoint[] = [];

	let fetchQuizScoreSummary = (grade: string, teacherName: string) => {};

	onMount(() => {
		fetchQuizScoreSummary = (grade: string, teacherName: string) => {
			tableLoading = true;
			makePostRequest(
				'/api/quiz/getSummary',
				{ grade, teacherName },
				(data) => {
					scoreData = data.summary;
					dataExists = data.dataExists;
					setTimeout(() => {
						tableLoading = false;
					}, 400);
				},
				(_err) => {
					scoreData = [];
					dataExists = false;
					setTimeout(() => {
						tableLoading = false;
					}, 400);
				}
			);
		};
	});

	$: fetchQuizScoreSummary(grade, teacherName);

	let tableLoading = false;
	let dataExists = true;
</script>

<Card id={'scorechart-card'} additionalClasses={'w-5/6'}>
	<ScoreChartGraph
		canvasId="chartContainer"
		{scoreData}
		title={teacherName !== 'all'
			? `Score Overview: ${teacherName.charAt(0).toUpperCase() + teacherName.slice(1)}'s Class`
			: `Score Overview: Grade ${grade} - Year 24-25`}
		loading={tableLoading}
		noData={!dataExists}
	/>
</Card>
