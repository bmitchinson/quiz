<script lang="ts">
	import { type QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
	import Card from '$lib/components/Card.svelte';
	import { onMount } from 'svelte';
	import ScoreChartGraph from '$lib/components/ScoreChart/ScoreChartGraph.svelte';
	import { makePostRequest } from '$lib/apiUtils';
	import GradeTeacherDropdown from './GradeTeacherDropdown.svelte';

	let scoreData: QuizScoreSummaryDataPoint[] = [];

	let fetchQuizScoreSummary = (grade: string, teacherName: string) => {};

	export let allTeachers: any[] = [];
	export let disableFilterControls = false;
	export let selectedGrade = '1';
	export let selectedTeacherName = 'all';

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

	$: fetchQuizScoreSummary(selectedGrade, selectedTeacherName);

	let tableLoading = false;
	let dataExists = true;

	let scoreChartTitle =
		selectedTeacherName !== 'all'
			? `Score Overview: ${selectedTeacherName.charAt(0).toUpperCase() + selectedTeacherName.slice(1)}'s Class`
			: `Score Overview: Grade ${selectedGrade} - Year 24-25`;
</script>

<Card id={'scorechart-card'} additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center mb-4 font-bold">{scoreChartTitle}</h1>
	{#if !disableFilterControls}
		<GradeTeacherDropdown
			bind:selectedGrade
			bind:selectedTeacherName
			teacherOptions={allTeachers}
		/>
	{/if}
	<ScoreChartGraph
		canvasId="chartContainer"
		{scoreData}
		loading={tableLoading}
		noData={!dataExists}
	/>
</Card>

<style>
	h1 {
		margin: 0;
	}
</style>
