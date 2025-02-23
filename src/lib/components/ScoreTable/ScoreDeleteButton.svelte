<script>
	// this component is exclusively rendered with a ts function
	// scoreId is a custom element property used by an event listener in the parent
	// @ts-nocheck

	import { createEventDispatcher } from 'svelte';

	export let scoreId = 0;
</script>

<div class="flex justify-center">
	<button
		type="button"
		{scoreId}
		class="m-1 p-1 px-2 rounded-md text-white bg-[#ff6961] hover:bg-[#ff9999] score-delete-btn"
	>
		Delete
	</button>
</div>
