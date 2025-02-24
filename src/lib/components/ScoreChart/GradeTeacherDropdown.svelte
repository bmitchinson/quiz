<script lang="ts">
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	import { grades } from '$lib/components/RadioButtons';

	export let teacherOptions: { name: string; grade: number }[] = [];
	export let selectedGrade = '1';
	export let selectedTeacherName = 'all';

	$: teacherOptionsForGrade = teacherOptions
		.filter((teacher) => teacher.grade === parseInt(selectedGrade))
		.map((teacher) => teacher.name);

	$: {
		selectedGrade;
		selectedTeacherName = 'all';
	}
</script>

<div class="flex flex-row space-x-4 justify-center">
	<div class="flex flex-row items-center space-x-4">
		<p class="block font-semibold">Grade:</p>
		<RadioButtons name="grade" options={grades} bind:selectedOptionValue={selectedGrade} />
	</div>
	<div class="flex flex-row items-center w-96 space-x-4">
		<span class="block font-semibold">Teacher:</span>
		<select bind:value={selectedTeacherName} class="w-full px-3 py-2 border rounded-md" required>
			<option value="all" selected>All Teachers</option>
			{#each teacherOptionsForGrade as teacher}
				<option value={teacher}>{teacher}</option>
			{/each}
		</select>
	</div>
</div>
