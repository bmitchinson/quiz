<!-- src/routes/admin/+page.svelte -->
<svelte:head>
	<title>Teacher: Home</title>
</svelte:head>

<div class="bg-white rounded-lg p-8 shadow-lg">
	<h1 class="text-2xl font-bold text-center mb-4">Teacher Options</h1>
	<div class="flex flex-col space-y-2">
		<a
			href="/teacher/manageStudents"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			Manage Students
		</a>
		<a
			href="/teacher/scores"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			View Class Scores
		</a>
		<a
			href="/teacher/quizzes"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			View Available Quizzes
		</a>
		<a
			href="/teacher/drawings"
			class="bg-[#26561b] text-white flex items-center justify-center px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
		>
			View Student Drawings
		</a>
	</div>
</div>
