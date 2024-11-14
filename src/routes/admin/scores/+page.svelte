<script>
	import Card from '$lib/components/Card.svelte';
	import { BarChart, Tooltip } from 'layerchart';

	const sampleData = [
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

<Card additionalClasses={'h-[33rem] w-5/6'}>
	<h1 class="text-3xl text-center font-bold mb-16">Grade 1: Scores</h1>
	<BarChart
		data={sampleData}
		x="quizName"
		y="averageScore"
		props={{ bars: { class: 'fill-[#26561b]' }, highlight: { area: false } }}
	>
		<svelte:fragment slot="tooltip" let:x let:y let:z>
			<Tooltip.Root let:data classes={{ container: 'bg-white p-4 outline rounded-lg' }}>
				<Tooltip.Header classes={{ root: 'text-xl' }}>{x(data)}</Tooltip.Header>
				<Tooltip.List>
					<Tooltip.Item
						classes={{ root: 'text-lg' }}
						label="Average Score:"
						value={`${y(data)} out of 10`}
					/>
					<Tooltip.Item
						classes={{ root: 'text-lg' }}
						label="Submitted Scores:"
						value={sampleData.find((ele) => ele.quizName === x(data))?.submittedScores}
					/>
				</Tooltip.List>
			</Tooltip.Root>
		</svelte:fragment>
	</BarChart>
</Card>
