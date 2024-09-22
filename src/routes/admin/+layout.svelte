<script lang="ts">
	export let data: { authenticated: boolean };

	let isAuthenticated = data.authenticated;
	let message = '';
	let success = false;

	async function submitPassword(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const response = await fetch('/admin', {
			method: 'POST',
			body: formData
		});
		const result = await response.json();

		if (result.success) {
			location.reload();
		} else {
			message = result.message || 'Authentication failed.';
			success = false;
		}
	}
</script>

{#if !isAuthenticated && isAuthenticated !== undefined}
	<div
		class="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 backdrop-blur-md"
	>
		<form
			on:submit={submitPassword}
			class="bg-white bg-opacity-70 shadow-lg rounded-lg p-8 m-8 w-full max-w-lg flex flex-col"
		>
			<h1 class="text-2xl font-bold mb-2 text-center">Admin Login</h1>
			<p class="text-center pb-4">Reach out to Will Mitchinson for the password</p>
			<input
				type="password"
				name="password"
				placeholder="Enter password"
				required
				class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>
			<button
				type="submit"
				class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
			>
				Submit
			</button>
			{#if message}
				<div class={`mt-4 message ${success ? 'success' : 'error'}`}>
					{message}
				</div>
			{/if}
		</form>
	</div>
{:else if isAuthenticated}
	<slot />
{/if}
