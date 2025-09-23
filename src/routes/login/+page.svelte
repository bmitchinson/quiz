<script lang="ts">
	import { goto } from '$app/navigation';
	import { grades } from '$lib/components/RadioButtons';
	import RadioButtons from '$lib/components/RadioButtons.svelte';
	let requestedLoginType = '';
	let inputValue = '';
	let teacherName = '';
	let errorMsg = '';
	let selectedGrade = '1';
	let selectedTeacher = '';

	export let data;
	$: teacherOptions = data.teachers
		.filter((teacher) => teacher.grade === parseInt(selectedGrade))
		.map((teacher) => teacher.name);

	// Handle form submission
	async function submitForm(event: Event) {
		event.preventDefault();

		const response = await fetch('/api/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				loginType: requestedLoginType,
				inputValue,
				selectedTeacher,
				teacherName
			})
		});

		const result = await response.json();
		if (result.success) {
			if (requestedLoginType === 'Admin') {
				goto('/admin');
			} else if (requestedLoginType === 'Teacher') {
				goto('/teacher');
			} else if (requestedLoginType === 'Student') {
				goto('/student');
			}
		} else {
			errorMsg = result.errorMsg;
		}
	}

	// Reset input values when loginType changes
	$: if (requestedLoginType) {
		inputValue = '';
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
				class="flex justify-beginning large-text bg-[#26561b] hover:bg-[#316f23] text-white px-4 py-2 rounded shadow transition w-full"
			>
				<span>🍎 Teacher</span>
			</button>
			<button
				on:click={() => (requestedLoginType = 'Student')}
				class="flex justify-beginning large-text items-center bg-[#26561b] text-white px-4 py-2 rounded shadow hover:bg-[#316f23] transition w-full"
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

		<!-- NOTE: Student -->
		{#if requestedLoginType === 'Student'}
			<div class="mb-4">
				<span class="block mb-2 font-semibold">Select Grade:</span>
				<RadioButtons name={'grade'} options={grades} bind:selectedOptionValue={selectedGrade} />
			</div>
			<div class="mb-4">
				<span class="block mb-2 font-semibold">Select Teacher:</span>
				<select bind:value={selectedTeacher} class="w-full px-3 py-2 border rounded-md" required>
					<option value="" disabled selected>Select your teacher</option>
					{#each teacherOptions as teacher}
						<option value={teacher}>{teacher}</option>
					{/each}
				</select>
			</div>
			<div class="mb-4">
				<span class="block mb-2 font-semibold">Enter Name</span>
				<p class="text-center pb-4">First Initial + Last Name - Example: mmouse</p>
				<input
					id="studentName"
					type="text"
					bind:value={inputValue}
					placeholder="mmouse"
					autocomplete="off"
					data-1p-ignore
					required
					class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
				/>
			</div>
			<!-- NOTE: Admin -->
		{:else if requestedLoginType === 'Admin'}
			<p class="text-center pb-4">Please enter the admin password</p>
			<input
				type="password"
				bind:value={inputValue}
				placeholder="Admin Password"
				autocomplete="off"
				data-1p-ignore
				required
				class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
			/>
			<!-- NOTE: Teacher -->
		{:else if requestedLoginType === 'Teacher'}
			<p class="text-center pb-4">Last Name</p>
			<input
				id="teacherName"
				type="text"
				bind:value={teacherName}
				placeholder="Smith"
				autocomplete="off"
				data-1p-ignore
				required
				class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
			/>
			<input
				id="teacherPassword"
				type="password"
				bind:value={inputValue}
				placeholder="Universal Teacher Password"
				autocomplete="off"
				data-1p-ignore
				required
				class="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#26561b]"
			/>
		{/if}

		<div class="w-full flex gap-2">
			<button
				type="reset"
				on:click={() => (requestedLoginType = '')}
				class="bg-gray-400 text-white font-semibold py-2 px-4 rounded-md transition duration-200 w-full"
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
				<div id="teacherLoginError" class="mt-4 message error">
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
