<script lang="ts">
	import ScoreChart from '$lib/components/ScoreChart.svelte';
	import { type ScoreDataPoint } from '$lib/chart/scoreTooltip';

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
</script>

<ScoreChart canvasId="chartContainer" scoreData={sampleData} title={'Grade 1: Scores'} />
<ScoreChart canvasId="chartContainer2" scoreData={sampleData} title={'Grade 1: Scores'} />
