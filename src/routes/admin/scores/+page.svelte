<script>
	import Card from '$lib/components/Card.svelte';
	import { BarChart, Tooltip } from 'layerchart';

	const sampleData = [
		{ score: 8, quizName: 'Q1-A' },
		{ score: 9, quizName: 'Q1-B' },
		{ score: 10, quizName: 'Q1-C' },
		{ score: 10, quizName: 'Q1-D' },
		{ score: 8, quizName: 'Q2-A' },
		{ score: 9, quizName: 'Q2-B' },
		{ score: 10, quizName: 'Q2-C' },
		{ score: 10, quizName: 'Q2-D' },
		{ score: 8, quizName: 'Q3-A' },
		{ score: 9, quizName: 'Q3-B' },
		{ score: 10, quizName: 'Q3-C' },
		{ score: 10, quizName: 'Q3-D' },
		{ score: 8, quizName: 'Q4-A' },
		{ score: 9, quizName: 'Q4-B' },
		{ score: 10, quizName: 'Q4-C' },
		{ score: 10, quizName: 'Q4-D' }
	];
</script>

<Card additionalClasses={'h-[30rem] w-11/12'}>
	<h1 class="text-3xl text-center font-bold mb-16">Grade 1: Scores</h1>
	<BarChart
		data={sampleData}
		x="quizName"
		y="score"
		props={{ bars: { class: 'fill-[#26561b]' }, highlight: { area: false } }}
	>
		<svelte:fragment slot="tooltip" let:x let:y>
			<Tooltip.Root let:data>
				<Tooltip.Header>{'123'}</Tooltip.Header>
				<Tooltip.List>
					<Tooltip.Item label="value" value={y(data)} />
				</Tooltip.List>
			</Tooltip.Root>
		</svelte:fragment>
	</BarChart>
</Card>
