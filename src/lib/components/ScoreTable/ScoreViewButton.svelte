<script>
	// this component is exclusively rendered with a ts function
	// scoreId is a custom element property used by an event listener in the parent
	// @ts-nocheck
	import { goto } from '$app/navigation';

	export let scoreId = 0;

	function handleClick() {
		goto(`/score/${scoreId}`);
	}
</script>

<div class="flex justify-center">
	<button
		type="button"
		{scoreId}
		class="m-1 p-1 px-2 rounded-md text-white bg-[#26561b] hover:bg-[#316f23] score-view-btn"
	>
		View
	</button>
</div>
