<script lang="ts">
	import { invalidateAll } from '$app/navigation';

	export let data: { students: { name: string }[] };
	let message = '';
	let success = false;
	let searchQuery = '';
	let currentPage = 1;
	const itemsPerPage = 5;

	// Computed property to get the filtered and paginated students
	$: filteredStudents = data.students.filter((student) =>
		student.name.toLowerCase().includes(searchQuery.toLowerCase())
	);
	$: paginatedStudents = filteredStudents.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);
	$: totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}

	async function deleteStudent(name: string) {
		if (
			window.confirm(
				`Are you sure you want to delete ${name}? This will delete all of their scores.`
			)
		) {
			const formData = new FormData();
			formData.append('name', name);

			const response = await fetch('?/deleteStudent', {
				method: 'POST',
				body: formData
			});

			const result = await response.json();
			if (result.status === 200) {
				message = 'Student deleted successfully. Ensure that they logout.';
				success = true;
				await invalidateAll();
			} else {
				message = 'Failed to delete student';
				success = false;
			}
		}
	}
</script>

<svelte:head>
	<title>Teacher: Manage Students</title>
</svelte:head>

<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
	<h1 class="text-2xl font-bold mb-6 text-center">Manage Students</h1>
	<form method="post" action="?/addStudents" class="space-y-4">
		<label for="lastNames" class="block text-gray-700 font-medium mb-2">
			Enter Student First Initial + Last Name (one per line):
		</label>
		<p>This name is what a student will enter as their "name" to take their quiz</p>
		<textarea
			id="lastNames"
			name="lastNames"
			rows="10"
			class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
			placeholder="jmitchell
jdenver
bdylan"
		></textarea>
		<div class="flex justify-center">
			<button
				type="submit"
				class="bg-[#26561b] hover:bg-[#316f23] text-white font-semibold py-2 px-4 rounded-md transition duration-200"
			>
				Add Students
			</button>
		</div>
	</form>
</div>

<div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
	<h2 class="text-2xl font-bold mb-6 text-center">Existing Students</h2>
	{#if message}
		<div
			class={`mb-4 p-4 rounded ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
		>
			{message}
		</div>
	{/if}
	<input
		id="name-search"
		type="text"
		placeholder="Search by last name"
		bind:value={searchQuery}
		class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
	/>
	<table class="min-w-full bg-white">
		<thead>
			<tr>
				<th class="py-2 px-4 border-b">Last Name</th>
				<th class="py-2 px-4 border-b">Actions</th>
			</tr>
		</thead>
		<tbody>
			{#each paginatedStudents as student}
				<tr class="p-2 student-row">
					<td class="py-2 px-4 border-b m-2">
						<div class="flex justify-center">
							{student.name}
						</div>
					</td>
					<td class="flex justify-center m-2">
						<button
							on:click={() => deleteStudent(student.name)}
							class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-2 rounded-md transition duration-200"
						>
							Delete
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="flex justify-between mt-4">
		<button
			on:click={() => goToPage(currentPage - 1)}
			class="px-4 py-2 bg-gray-300 rounded-md"
			disabled={currentPage === 1}
		>
			Previous
		</button>
		<span>Page {currentPage} of {totalPages}</span>
		<button
			on:click={() => goToPage(currentPage + 1)}
			class="px-4 py-2 bg-gray-300 rounded-md"
			disabled={currentPage === totalPages}
		>
			Next
		</button>
	</div>
</div>
