<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	let loginType = '';
	let inputValue = '';
	let message = '';
	let success = false;

	// Handle form submission
	async function submitForm(event: Event) {
		event.preventDefault();

		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ loginType, inputValue })
		});

		const result = await response.json();
		if (response.ok) {
			success = true;
			message = result.message;
			// Redirect or perform actions based on loginType
			if (loginType === 'admin') {
				goto('/admin/dashboard');
			} else if (loginType === 'teacher') {
				goto('/teacher/dashboard');
			} else if (loginType === 'student') {
				goto('/student/dashboard');
			}
		} else {
			success = false;
			message = result.error;
		}
	}

	// Reset input values when loginType changes
	$: if (loginType) {
		inputValue = '';
		message = '';
	}
</script>

<svelte:head>
	<title>Quiz: Home</title>
</svelte:head>

<!-- Initial Selection -->
{#if !loginType}
	<div class="bg-white rounded-lg p-8 shadow-lg">
		<div class="flex flex-col space-y-2">
			<button
				on:click={() => (loginType = 'admin')}
				class="flex justify-beginning large-text items-center bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition w-full"
			>
				<span>📔 Admin</span>
			</button>
			<button
				on:click={() => (loginType = 'teacher')}
				class="flex justify-beginning large-text bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition w-full"
			>
				<span>🍎 Teacher</span>
			</button>
			<button
				on:click={() => (loginType = 'student')}
				class="flex justify-beginning large-text items-center bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition w-full"
			>
				<span>🧑‍🎓 Student</span>
			</button>
		</div>
	</div>
{/if}

<!-- Admin Login Form -->
{#if loginType === 'admin'}
	<form
		on:submit|preventDefault={submitForm}
		class="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg flex flex-col"
	>
		<h1 class="text-2xl font-bold mb-2 text-center">Admin Login</h1>
		<p class="text-center pb-4">Please enter the admin password.</p>
		<input
			type="password"
			bind:value={inputValue}
			placeholder="Enter password"
			required
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
{/if}

<!-- Teacher Login Form -->
{#if loginType === 'teacher'}
	<form
		on:submit|preventDefault={submitForm}
		class="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg flex flex-col"
	>
		<h1 class="text-2xl font-bold mb-2 text-center">Teacher Login</h1>
		<p class="text-center pb-4">Enter your first initial and last name (e.g., JSmith).</p>
		<input
			type="text"
			bind:value={inputValue}
			placeholder="Enter your username"
			required
			class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
		/>
		<button
			type="submit"
			class="bg-[#26561b] hover:bg-[#316f23] text-white font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
		>
			Continue
		</button>
		{#if message}
			<div class={`mt-4 message ${success ? 'success' : 'error'}`}>
				{message}
			</div>
		{/if}
	</form>
{/if}

<!-- Student Login Form -->
{#if loginType === 'student'}
	<form
		on:submit|preventDefault={submitForm}
		class="bg-white shadow-lg rounded-lg p-8 m-8 w-full max-w-lg flex flex-col"
	>
		<h1 class="text-2xl font-bold mb-2 text-center">Student Login</h1>
		<p class="text-center pb-4">Enter your first initial and last name (e.g., MMouse).</p>
		<input
			type="text"
			bind:value={inputValue}
			placeholder="Enter your name"
			required
			class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
		/>
		<button
			type="submit"
			class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
		>
			Continue
		</button>
		{#if message}
			<div class={`mt-4 message ${success ? 'success' : 'error'}`}>
				{message}
			</div>
		{/if}
	</form>
{/if}

<style>
	.message {
		padding: 1rem;
		border-radius: 0.25rem;
	}
	.success {
		background-color: #d4edda;
		color: #155724;
	}
	.error {
		background-color: #f8d7da;
		color: #721c24;
	}
	.large-text {
		font-size: 2em; /* Makes the emoji twice the size */
	}
</style>
