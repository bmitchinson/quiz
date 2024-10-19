<svelte:head>
	<title>Quiz: Home</title>
</svelte:head>

<div class="bg-white rounded-lg p-8 shadow-lg">
	<div class="flex flex-col space-y-2">
		<a
			href="/admin/students"
			class="bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
			>Teacher: Manage Students</a
		>
		<a
			href="/admin/quizzes"
			class="bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
			>Teacher: Manage Quizzes</a
		>
		<a
			href="/student/takeQuiz"
			class="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition"
			>Student: Take a Quiz</a
		>
	</div>
</div>
