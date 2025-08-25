<!-- src/routes/admin/+page.svelte -->
<svelte:head>
	<title>Admin: Home</title>
</svelte:head>

<div class="bg-white rounded-lg p-8 shadow-lg">
	<h1 class="text-2xl font-bold text-center mb-4">Admin Options</h1>
	<div class="flex flex-col space-y-2">
		<a
			href="/admin/manageQuizzes"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			Manage Quizzes
		</a>
		<a
			href="/admin/scores"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			View Scores
		</a>
		<a
			href="/admin/drawings"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			View Drawings
		</a>
	</div>
</div>
