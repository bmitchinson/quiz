<script lang="ts">
	export let options = [] as { t: string; v: string }[];
	export let selectedOptionValue = '';
	export let name = '';
</script>

<div class="flex flex-row space-x-4">
	{#each options as { t, v }, i}
		<label class="flex flex-items-center cursor-pointer">
			<input
				type="radio"
				{name}
				bind:group={selectedOptionValue}
				value={v}
				class="hidden-input {i === 0 ? 'first-input' : ''}"
				autocomplete="off"
				data-1p-ignore
				required
			/>
			<div
				id="{name}-select-{v}"
				class={'px-4 py-2 border rounded-md transition-colors duration-200 ' +
					(selectedOptionValue === v ? 'bg-[#26561b] text-white' : '')}
			>
				{t}
			</div>
		</label>
	{/each}
</div>

<style>
	/* hacks to move the browser "required" tooltip */
	/* Hide the input visually but keep it in the DOM */
	.hidden-input {
		position: absolute;
		opacity: 0;
		pointer-events: none;
	}

	/* Hidden jank to adjust the invisible position of the first input */
	/* Lets you choose where you want browser built in "required" tooltip */
	.first-input {
		top: 30px; /* Adjust as needed */
		left: 35.57%; /* Center horizontally */
		transform: translateX(-35.57%);
	}
</style>
