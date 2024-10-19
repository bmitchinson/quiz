<svelte:head>
	<title>Admin: Home</title>
</svelte:head>

<div class="bg-white rounded-lg p-8 shadow-lg">
	<div class="flex flex-col space-y-2">
		<a
			href="/admin/manageQuizzes"
			class="bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
			>Manage Quizzes</a
		>
		<a
			href="/admin/quizScores"
			class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
			>View Quiz Scores</a
		>
	</div>
</div>
