<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let isAuthenticated: undefined | Boolean = undefined;
	let message = '';
	let success = false;

	onMount(() => {
		const auth = localStorage.getItem('auth');
		const timestamp = localStorage.getItem('auth_timestamp') || '0';
		const age = Date.now() - Number(timestamp);
		if (auth === 'true' && timestamp && age < 3600000) {
			isAuthenticated = true;
		} else {
			isAuthenticated = false;
			localStorage.removeItem('auth');
			localStorage.removeItem('auth_timestamp');
		}
	});

	async function submitPassword(event: Event) {
		event.preventDefault();
		const form = event.target as HTMLFormElement;
		const formData = new FormData(form);
		const response = await fetch('/admin', {
			method: 'POST',
			body: formData
		});
		const result = await response.json();
		console.log('result:', result);

		if (result.success) {
			isAuthenticated = true;
			localStorage.setItem('auth', 'true');
			localStorage.setItem('auth_timestamp', Date.now().toString());
			message = 'Authentication successful!';
			success = true;
			await invalidateAll(); // Refresh data without reloading
		} else {
			message = result.message || 'Authentication failed.';
			console.log('message:', message);
			success = false;
		}
	}
</script>

{#if !isAuthenticated && isAuthenticated !== undefined}
	<div class="flex justify-center items-center min-h-screen">
		<form
			on:submit={submitPassword}
			class="password-form bg-white shadow-md rounded-lg m-8 w-full max-w-lg flex flex-col w-72 p-8"
		>
			<h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
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
				<div class={`message ${success ? 'success' : 'error'}`}>
					{message}
				</div>
			{/if}
		</form>
	</div>
{:else if isAuthenticated}
	<slot />
{/if}
