<!-- src/routes/student/+page.svelte -->
<script lang="ts">
	import { getButtonStyles } from '$lib/cssUtils';
</script>

<svelte:head>
	<title>Student: Home</title>
</svelte:head>

<div class="bg-white rounded-lg p-8 shadow-lg">
	<h1 class="text-2xl font-bold text-center mb-4">Student Options</h1>
	<div class="flex flex-col space-y-2">
		<a
			href="/student/takeQuiz"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			Take Quiz
		</a>
		<a
			href="/student/scores"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			View My Scores
		</a>
	</div>
</div>
