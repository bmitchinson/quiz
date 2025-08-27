<script lang="ts">
	import { getReadableTitleOfQuiz } from '$lib/dataUtils';
	import Card from '$lib/components/Card.svelte';
	import { format } from 'date-fns';
	import { goto } from '$app/navigation';
	import GradeTeacherDropdown from '$lib/components/ScoreChart/GradeTeacherDropdown.svelte';
	import { getButtonStyles } from '$lib/cssUtils';
	import { enhance } from '$app/forms';

	export let data;
	export let form;

	$: drawings = data.drawings;
	$: currentPage = data.currentPage;
	$: totalPages = data.totalPages;
	$: totalItems = data.total;

	// Filter state
	let selectedGrade = '';
	let selectedTeacher = '';

	function clearFilters() {
		selectedGrade = '';
		selectedTeacher = '';
		// navigate to the same page without any query params
		goto(window.location.pathname);
	}

	function applyFilters() {
		const params = new URLSearchParams();
		params.set('page', '1');

		if (selectedGrade) params.set('grade', selectedGrade);
		if (selectedTeacher && selectedTeacher !== 'all') params.set('teacherName', selectedTeacher);

		goto(`?${params.toString()}`);
	}

	function goToPage(page: number) {
		if (page < 1 || page > totalPages) return;

		const params = new URLSearchParams(window.location.search);
		params.set('page', page.toString());
		goto(`?${params.toString()}`);
	}

	// Helper function to format the date nicely
	function formatDate(date: Date): string {
		return format(new Date(date), 'PPp'); // e.g., "Apr 24, 2025, 3:45 PM"
	}
</script>

<svelte:head>
	<title>Admin: Student Drawings</title>
</svelte:head>

<Card additionalClasses={'w-5/6'}>
	<div class="text-2xl font-bold text-center">Student Drawings</div>

	<!-- Filter Controls -->
	<div class="flex flex-row flex-wrap justify-center items-center space-y-4 space-x-4">
		<!-- Using GradeTeacherDropdown component -->
		<GradeTeacherDropdown
			bind:selectedGrade
			bind:selectedTeacherName={selectedTeacher}
			teacherOptions={data.teachers}
		/>

		<button on:click={clearFilters} class="${getButtonStyles()} "> Clear Filters </button>
		<button on:click={applyFilters} class="${getButtonStyles()} "> Apply Filters </button>
	</div>

	<!-- Drawings Display -->
	{#if drawings.length === 0}
		<div class="text-center py-8">
			<p class="text-gray-600">No drawings found. Try adjusting your filters.</p>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
			{#each drawings as drawing}
				{#if drawing.jpgBase64}
					<div class="border-2 border-[#26561b] rounded-lg p-4 drawing-card">
						<div class="font-bold text-lg">{drawing.student.name}</div>
						<div class="text-gray-600 text-sm">
							Quiz: {getReadableTitleOfQuiz(drawing.quiz)} ({drawing.accessCode})
						</div>
						<div class="text-gray-500 text-xs mb-2">
							Created: {formatDate(drawing.timeStarted)}
						</div>
						<div class="w-full overflow-hidden rounded-md">
							<img
								src={drawing.jpgBase64}
								alt={`Drawing by ${drawing.student.name}`}
								class="w-full h-full object-contain"
							/>
						</div>
						<div class="mt-3 flex justify-end">
							<form action="?/deleteDrawing" method="POST" use:enhance>
								<input type="hidden" name="drawingId" value={drawing.id} />
								<button
									type="submit"
									class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm"
									onclick="return confirm('Are you sure you want to delete this drawing? This cannot be undone.')"
								>
									Delete
								</button>
							</form>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<!-- Pagination -->
	{#if totalPages > 1}
		<div class="flex justify-center items-center mt-8 space-x-4">
			<button
				on:click={() => goToPage(currentPage - 1)}
				class="px-4 py-2 bg-gray-300 rounded-md"
				disabled={currentPage === 1}
			>
				Previous
			</button>

			<span class="text-sm" id="page-x-of-y">
				Page {currentPage} of {totalPages}
				<span class="text-gray-500" id="total-drawings">({totalItems} drawings)</span>
			</span>

			<button
				on:click={() => goToPage(currentPage + 1)}
				class="px-4 py-2 bg-gray-300 rounded-md"
				disabled={currentPage === totalPages}
			>
				Next
			</button>
		</div>
	{/if}
</Card>

<style>
	/* Any additional component styles can go here */
</style>
