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
	<form
		on:submit={submitPassword}
		class="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg flex flex-col"
	>
		<h1 class="text-2xl font-bold mb-2 text-center">Teacher Login</h1>
		<p class="text-center pb-4">Reach out to Will Mitchinson for the password</p>
		<input
			type="password"
			name="password"
			placeholder="Enter password"
			required
			data-1p-ignore
			class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
		/>
		<button
			type="submit"
			class="bg-[#26561b] hover:bg-[#316f23] text-white font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
		>
			Submit
		</button>
		{#if message}
			<div class={`mt-4 message ${success ? 'success' : 'error'}`}>
				{message}
			</div>
		{/if}
	</form>
{:else if isAuthenticated}
	<slot />
{/if}
