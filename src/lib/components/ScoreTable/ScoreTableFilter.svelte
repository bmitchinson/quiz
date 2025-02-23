<script lang="ts">
	import { grades } from '$lib/components/RadioButtons';
	import { getButtonStyles } from '../../cssUtils';

	export let allTeachers: { grade: number; name: string }[] = [];

	export let lockedToTeacher = false;
	export let grade = '1';
	export let teacherName = '';
	export let quizQuarter = '1';
	export let quizSequenceLetter = 'A';
	export let searchOnClick = () => {};

	// todo: year - add year selector

	$: teacherOptionsForGrade = allTeachers
		.filter((teacher) => teacher.grade === parseInt(grade))
		.map((teacher) => teacher.name);

	$: {
		grade;
		teacherName = '';
	}
</script>

<div class="flex flex-row space-x-4 justify-center items-center">
	{#if !lockedToTeacher}
		<div class="flex flex-row items-center space-x-2">
			<span class="block font-semibold">Grade:</span>
			<select
				bind:value={grade}
				id="scoreTableGradeFilter"
				class="w-full px-3 py-2 border rounded-md"
				required
			>
				{#each grades as grade}
					<option value={grade.v}>{grade.t}</option>
				{/each}
			</select>
		</div>

		<div class="flex flex-row items-center space-x-2">
			<span class="block font-semibold">Teacher:</span>
			<select bind:value={teacherName} class="w-full px-3 py-2 border rounded-md" required>
				<option value="">All Teachers</option>
				{#each teacherOptionsForGrade as teacher}
					<option value={teacher}>{teacher}</option>
				{/each}
			</select>
		</div>
	{/if}

	<div class="flex flex-row items-center space-x-2">
		<span class="block font-semibold">Quiz Quarter:</span>
		<select bind:value={quizQuarter} class="px-3 py-2 border rounded-md" required>
			<option value="1">1st Quarter</option>
			<option value="2">2nd Quarter</option>
			<option value="3">3rd Quarter</option>
			<option value="4">4th Quarter</option>
			<option value="">All</option>
		</select>
	</div>

	<div class="flex flex-row items-center space-x-2">
		<span class="block font-semibold">Quiz Sequence Letter:</span>
		<select bind:value={quizSequenceLetter} class="px-3 py-2 border rounded-md" required>
			<option value="A">A</option>
			<option value="B">B</option>
			<option value="C">C</option>
			<option value="D">D</option>
			<option value="">All</option>
		</select>
	</div>

	<div id="scoreTableFetchData" class={getButtonStyles(false)} on:click={searchOnClick}>
		Fetch Data
	</div>
</div>
