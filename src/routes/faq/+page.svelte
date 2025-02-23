<script>
	import Break from '$lib/components/Break.svelte';
	import Wave from '$lib/components/Wave.svelte';
</script>

<div class="bg-white rounded-lg p-8 shadow-lg max-w-lg">
	<div class="flex flex-col space-y-4">
		<Wave />
		<Break />
		<p class="text-base">
			I wrote this app for students to take math quizzes in an effort to save teachers time grading.
		</p>

		<Break />

		<p class="text-base">
			If it's broken in any way, please reach out to mitchinson.dev@gmail.com +
			wmitchinson@d124.org. If this site is making your job difficult, I'd like to address that
			ASAP.
		</p>

		<Break />

		<div>
			<h2 class="text-2xl font-bold">FAQ</h2>
			<h4 class="text-lg mt-4 font-semibold">How do I login?</h4>
			<p>
				Navigate to the homepage and choose "Teacher". Enter in your lastname, and the "Universal
				Teacher Password" provided to you by Will Mitchinson.
			</p>
			<h4 class="text-lg mt-4 font-semibold">How can a student retake a quiz?</h4>
			<p>
				Login as a teacher or admin and choose "View Scores". From there, you can delete the
				student's score, and they'll be eligible to retake it.
			</p>
		</div>

		<Break />

		<div class="text-center">
			Made w/ 💚 in Des Moines 🌽 - <a
				href="https://github.com/bmitchinson/quiz"
				style="color: cornflowerblue"
			>
				Source Code
			</a>
			<div class="mt-4">
				Ben Mitchinson
				<a href="https://mitchinson.dev" style="color: cornflowerblue">
					(https://mitchinson.dev)
				</a> mitchinson.dev@gmail.com
			</div>
		</div>
	</div>
</div>
