<script lang="ts">
	import ScoreChart from '$lib/components/ScoreChart.svelte';
	import { type QuizScoreSummaryDataPoint } from '$lib/chart/scoreTooltip';
	import Card from '$lib/components/Card.svelte';
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	import { grades } from '$lib/components/RadioButtons';
	import { onMount } from 'svelte';

	export let data;
	$: teacherOptions = data.teachers
		.filter((teacher) => teacher.grade === parseInt(selectedGrade))
		.map((teacher) => teacher.name);

	let sampleData: QuizScoreSummaryDataPoint[] = [];

	let fetchQuizScoreSummary = (grade: string, teacher: string) => {};

	onMount(() => {
		fetchQuizScoreSummary = (grade: string, teacher: string) => {
			tableLoading = true;
			fetch('/api/quiz/getSummary', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ grade, teacher })
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
	let selectedTeacher = 'all';
	$: fetchQuizScoreSummary(selectedGrade, selectedTeacher);

	let tableLoading = false;
	let dataExists = true;
</script>

<Card id={'scorechart-card'} additionalClasses={'w-5/6'}>
	<div class="flex flex-row items-center justify-center space-x-4 flex-wrap">
		<div class="flex flex-row items-center space-x-4">
			<p class="block text-gray-700 font-medium">Grade:</p>
			<RadioButtons name="grade" options={grades} bind:selectedOptionValue={selectedGrade} />
		</div>
		<div class="flex flex-row items-center w-96 space-x-4">
			<span class="block font-semibold">Teacher:</span>
			<select bind:value={selectedTeacher} class="w-full px-3 py-2 border rounded-md" required>
				<option value="all" selected>All Teachers</option>
				{#each teacherOptions as teacher}
					<option value={teacher}>{teacher}</option>
				{/each}
			</select>
		</div>
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
