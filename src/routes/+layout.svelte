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

	let bannerText = data.bannerText;

	let selectedSchoolYear = data.selectedSchoolYear; // Use value from cookie

	const handleSchoolYearChange = async () => {
		try {
			const response = await fetch('/api/set-school-year', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ schoolYear: selectedSchoolYear })
			});

			if (response.ok) {
				location.reload();
			}
		} catch (error) {
			console.error('Failed to set school year:', error);
		}
	};
</script>

<div class="flex flex-col items-center h-screen justify-between">
	<header
		class="bg-white backdrop-blur-md shadow-lg p-4 w-full relative flex items-center justify-center py-8"
	>
		<div class="absolute left-4 flex items-center space-x-4">
			<a href="/" class="z-10">
				<h1 class="text-3xl font-bold">{bannerText}</h1>
			</a>
			<a
				href="/"
				class="bg-[#26561b] hover:bg-[#316f23] text-white px-4 py-2 rounded-md transition duration-300"
				>Home</a
			>
			<a
				href="/faq"
				class="bg-[#26561b] hover:bg-[#316f23] text-white px-4 py-2 rounded-md transition duration-300"
				>FAQ</a
			>
		</div>

		<!-- Right-side Username and Logout Button -->
		{#if data.loginType}
			<div class="absolute right-4 flex items-center space-x-4">
				<span class="text-lg font-medium">{userText}</span>
				{#if data.loginType === 'Admin' || data.loginType === 'Teacher'}
					<!-- TODO: Why does this flicker from last year to now 🤔 -->
					<select
						bind:value={selectedSchoolYear}
						on:change={handleSchoolYearChange}
						id="year-dropdown"
						class="bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#26561b] focus:border-transparent"
					>
						{#each data.schoolYearOptions as year}
							<option value={year.value}>{year.label}</option>
						{/each}
					</select>
				{/if}
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
