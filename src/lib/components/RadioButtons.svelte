<script lang="ts">
	export let options = [] as { t: string; v: string }[];
	export let selectedOptionValue = '';
</script>

{#each options as { t, v }, i}
	<label class="flex items-center cursor-pointer">
		<input
			type="radio"
			name="grade"
			bind:group={selectedOptionValue}
			value={v}
			class="hidden-input {i === 0 ? 'first-input' : ''}"
			autocomplete="off"
			data-1p-ignore
			required
		/>
		<div
			id="grade-btn-{v}"
			class={'px-4 py-2 border rounded-md transition-colors duration-200 ' +
				(selectedOptionValue === v ? 'bg-[#26561b] text-white' : '')}
		>
			{v}{t}
		</div>
	</label>
{/each}

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
