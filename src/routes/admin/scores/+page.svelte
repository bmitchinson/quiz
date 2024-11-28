<script lang="ts">
	import ScoreChart from '$lib/components/ScoreChart.svelte';
	import { type QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
	import Card from '$lib/components/Card.svelte';
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	import { grades } from '$lib/components/RadioButtons';
	import { onMount } from 'svelte';

	let sampleData: QuizScoreSummaryDataPoint[] = [];

	let onGradeChange = (n: string) => {};

	onMount(() => {
		onGradeChange = (newSelectedGrade: string) => {
			tableLoading = true;
			fetch('/api/quiz/getSummary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ grade: newSelectedGrade })
			})
				.then((res) => res.json())
				.then((data) => {
					sampleData = data.summary;
					dataExists = data.dataExists;
					console.log(data);
					setTimeout(() => {
						tableLoading = false;
					}, 400);
				})
				.catch((err) => {
					console.error(err);
					sampleData = [];
					dataExists = false;
					setTimeout(() => {
						tableLoading = false;
					}, 400);
				});
		};
	});

	let selectedGrade = '1';
	$: onGradeChange(selectedGrade);

	let tableLoading = false;
	let dataExists = true;
</script>

<Card id={'scorechart-card'} additionalClasses={'w-5/6'}>
	<div class="flex flex-row items-center justify-center space-x-4">
		<p class="block text-gray-700 font-medium">Select Grade:</p>
		<RadioButtons name="grade" options={grades} bind:selectedOptionValue={selectedGrade} />
	</div>
	<ScoreChart
		canvasId="chartContainer"
		scoreData={sampleData}
		title={`Score Overview: Grade ${selectedGrade} - Year 24-25`}
		loading={tableLoading}
		noData={!dataExists}
	/>
</Card>

<Card additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center font-bold">Student Scores</h1>
</Card>
