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
			If it's broken in any way, let me know! If this site is making your job difficult, I'd like to
			address that ASAP.
		</p>

		<Break />

		<p class="text-base">
			I'm also available for further consulting work, keep me in mind if you'd like fast web
			applications built in 2 week timelines.
		</p>

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
