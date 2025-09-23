<script lang="ts">
	import { onMount } from 'svelte';
	import { DataTable } from 'simple-datatables';
	import { makePostRequest } from '$lib/apiUtils';
	import Card from '$lib/components/Card.svelte';
	import { createDataTable, scoreIdToDeleteStore } from './ScoreTable';
	import LoadingSquare from '../LoadingSquare.svelte';
	import ScoreTableFilter from './ScoreTableFilter.svelte';
	import type { GetScoresResult } from '$lib/database';

	export let allTeachers: { grade: number; name: string }[] = [];

	let fetchScores = () => {};
	let scoresLoading = false;
	let scoresErrorMsg = '';
	let dataTable = null as DataTable;

	export let grade = '1';
	export let selectedTeacherName = 'all';
	export let signedInTeacherName = '';
	let quizQuarter = '1';
	let quizSequenceLetter = 'A';

	onMount(() => {
		fetchScores = () => {
			scoresLoading = true;
			// TODO why couldn't I make this generic, broke ts imports
			makePostRequest(
				'/api/quiz/getScores',
				{
					grade: parseInt(grade),
					teacherName: signedInTeacherName || selectedTeacherName,
					quizQuarter: parseInt(quizQuarter),
					quizSequenceLetter
				},
				(data: { scores: GetScoresResult }) => {
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

		scoreIdToDeleteStore.subscribe((event) => {
			const scoreId = event?.scoreIdToDelete;
			if (!scoreId) return;
			makePostRequest(
				'/api/score/delete',
				{
					scoreId
				},
				(data: { success: boolean }) => {
					if (data.success) {
						fetchScores();
					}
				},
				(err) => {
					console.log(`ERROR DELETING SCORE: ${scoreId}`, err);
				}
			);
		});

		fetchScores();
	});
</script>

<Card id="scoreTable" additionalClasses={'w-5/6'}>
	<h1 class="text-3xl text-center mb-4 font-bold">Student Scores</h1>
	<ScoreTableFilter
		bind:grade
		bind:teacherName={selectedTeacherName}
		{allTeachers}
		bind:quizQuarter
		bind:quizSequenceLetter
		searchOnClick={fetchScores}
		lockedToTeacher={!!signedInTeacherName}
	/>
	{#if scoresLoading}
		<div class="w-full flex flex-row justify-center">
			<LoadingSquare />
		</div>
	{/if}
	<div class={scoresLoading ? 'hidden' : ''}>
		<table class="w-full" id="scores-table" />
	</div>
</Card>

<style>
	:global(#scores-table td) {
		/* text-align: center; */
		border: 1px solid #e2e8f0;
	}

	:global(#scores-table th) {
		text-align: left;
		/* border: 1px solid #e2e8f0; */
	}

	:global(.datatable-pagination-list) {
		gap: 1em;
		display: flex;
		width: 100%;
	}

	:global(.datatable-search) {
		border: 2px solid black;
	}

	h1 {
		margin: 0;
	}

	:global(.datatable-bottom) {
		margin-top: 1em;
	}
</style>
