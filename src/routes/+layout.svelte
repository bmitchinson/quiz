<script lang="ts">
	import '../app.css';

	export let data;

	const logout = async () => {
		await fetch('/api/logout', {
			method: 'POST'
		}).then(() => {
			location.reload();
		});
	};

	$: userText = data.loginType === 'Admin' ? 'Admin' : `${data.loginType}: ${data.loginName}`;
</script>

<div class="flex flex-col items-center h-screen justify-between">
	<header
		class="bg-white backdrop-blur-md shadow-lg p-4 w-full relative flex items-center justify-center py-8"
	>
		<div class="absolute left-4 flex items-center space-x-4">
			<a href="/" class="z-10">
				<h1 class="text-3xl font-bold">Quiz App</h1>
			</a>
			<a
				href="/"
				class="bg-[#26561b] hover:bg-[#316f23] text-white px-4 py-2 rounded-md transition duration-300"
				>Home</a
			>
			<a
				href="/about"
				class="bg-[#26561b] hover:bg-[#316f23] text-white px-4 py-2 rounded-md transition duration-300"
				>About</a
			>
		</div>

		<!-- Right-side Username and Logout Button -->
		{#if data.loginType}
			<div class="absolute right-4 flex items-center space-x-4">
				<span class="text-lg font-medium">{userText}</span>
				<button
					class="bg-[#26561b] hover:bg-[#316f23] text-white px-4 py-2 rounded-md transition duration-300"
					on:click={logout}
				>
					Logout
				</button>
			</div>
		{/if}
	</header>

	<main class="flex-grow gap-8 flex items-center justify-center flex-wrap w-full p-8">
		<slot />
	</main>
</div>
