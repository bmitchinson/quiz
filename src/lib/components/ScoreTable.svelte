<script lang="ts">
	import { onMount } from 'svelte';
	import { DataTable } from 'simple-datatables';
	import { makePostRequest } from '$lib/apiUtils';
	import Card from '$lib/components/Card.svelte';
	import type { GetScoresScore } from '$lib/database';
	import { createDataTable } from './ScoreTable';

	let fetchScores = () => {};
	let scoresLoading = false;
	let scoresErrorMsg = '';
	let dataTable = null as DataTable;

	export let grade = '1';

	$: {
		grade;
		fetchScores();
	}

	onMount(() => {
		fetchScores = () => {
			scoresLoading = true;
			makePostRequest(
				'/api/quiz/getScores',
				{ grade: parseInt(grade) },
				(data: { scores: GetScoresScore[]; dataExists: boolean }) => {
					dataTable && dataTable.destroy();
					dataTable = createDataTable('scores-table', data.scores);
					setTimeout(() => {
						scoresLoading = false;
					}, 400);
				},
				(_err: any) => {
					setTimeout(() => {
						scoresLoading = false;
					}, 400);
				}
			);
		};

		fetchScores();
	});
</script>

<Card additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center font-bold">Student Scores</h1>
	<table id="scores-table"></table>
</Card>
