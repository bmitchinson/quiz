<!-- src/routes/+page.svelte -->
<script>
	import GoogleLogin from '$lib/components/GoogleLogin.svelte';
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="flex flex-col items-center space-y-4 p-6">
		<h1 class="text-3xl">Welcome to this login sample!</h1>
		<GoogleLogin />
		<h2 class="text-xl" id="email">Email: ~~~</h2>
		<img
			src="https://res.cloudinary.com/dheqbiqti/image/upload/v1679284720/theo.png"
			width={150}
			height={150}
		/>
	</div>
</div>
