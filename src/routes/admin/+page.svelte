<script lang="ts">
	let message = '';
	let success = false;
</script>

<svelte:head>
	<title>Admin View</title>
</svelte:head>

<div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
	<div class="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
		<h1 class="text-2xl font-bold mb-6 text-center">Admin View</h1>
		{#if message}
			<div
				class={`mb-4 p-4 rounded ${success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
			>
				{message}
			</div>
		{/if}
		<form method="post" action="?/addStudents" class="space-y-4">
			<div>
				<label for="lastNames" class="block text-gray-700 font-medium mb-2">
					Enter Student First Initial + Last Name (one per line):
				</label>
				<p>This name is what a student will enter as their "name" to take their quiz</p>
				<textarea
					id="lastNames"
					name="lastNames"
					rows="10"
					class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder="jmitchell
jdenver
bdylan"
				></textarea>
			</div>
			<div class="flex justify-center">
				<button
					type="submit"
					class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
				>
					Add Students
				</button>
			</div>
		</form>
	</div>
</div>
