<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	let requestedLoginType = '';
	let inputValue = '';
	let errorMsg = '';
	let passwordPrompt = '';
	let passwordPlaceholder = '';

	// Handle form submission
	async function submitForm(event: Event) {
		event.preventDefault();

		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ loginType: requestedLoginType, inputValue })
		});

		const result = await response.json();
		if (result.success) {
			if (requestedLoginType === 'Admin') {
				goto('/admin');
			} else if (requestedLoginType === 'Teacher') {
				goto('/teacher/dashboard');
			} else if (requestedLoginType === 'Student') {
				goto('/student/dashboard');
			}
		} else {
			errorMsg = result.errorMsg;
		}
	}

	// Reset input values when loginType changes
	$: if (requestedLoginType) {
		inputValue = '';
		passwordPrompt =
			requestedLoginType === 'Admin'
				? 'Please enter the admin password'
				: 'Enter your first initial and last name - Ex: JSmith';
		passwordPlaceholder = requestedLoginType === 'Admin' ? 'Admin Password' : 'Name';
		errorMsg = '';
	}
</script>

<svelte:head>
	<title>Quiz: Login</title>
</svelte:head>

<!-- Initial Selection -->
{#if !requestedLoginType}
	<div class="bg-white rounded-lg p-8 shadow-lg">
		<div class="flex flex-col gap-y-4 space-y-2">
			<button
				on:click={() => (requestedLoginType = 'Admin')}
				class="flex justify-beginning large-text items-center bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition w-full"
			>
				<span>📔 Admin</span>
			</button>
			<button
				on:click={() => (requestedLoginType = 'Teacher')}
				class="flex justify-beginning large-text bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition w-full"
			>
				<span>🍎 Teacher</span>
			</button>
			<button
				on:click={() => (requestedLoginType = 'Student')}
				class="flex justify-beginning large-text items-center bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition w-full"
			>
				<span>🧑‍🎓 Student</span>
			</button>
		</div>
	</div>
{:else}
	<form
		on:submit|preventDefault={submitForm}
		class="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg flex flex-col"
	>
		<h1 class="text-2xl font-bold mb-2 text-center">{requestedLoginType} Login</h1>
		<p class="text-center pb-4">{passwordPrompt}</p>
		<input
			type="password"
			bind:value={inputValue}
			placeholder={passwordPlaceholder}
			required
			class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
		/>
		<div class="w-full flex gap-2">
			<button
				type="reset"
				on:click={() => (requestedLoginType = '')}
				class="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
			>
				Back
			</button>
			<button
				type="submit"
				class="bg-[#26561b] hover:bg-[#316f23] text-white font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
			>
				Submit
			</button>
		</div>
		<div>
			{#if errorMsg}
				<div class="mt-4 message error">
					{errorMsg}
				</div>
			{/if}
		</div>
	</form>
{/if}

<style>
	.message {
		padding: 1rem;
		border-radius: 0.25rem;
	}
	.error {
		background-color: #f8d7da;
		color: #721c24;
	}
	.large-text {
		font-size: 2em;
	}
</style>
