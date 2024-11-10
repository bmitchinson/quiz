<script lang="ts">
	import { page } from '$app/stores';
	import Break from '$lib/components/Break.svelte';
	import Card from '$lib/components/Card.svelte';

	const status = $page.status;
	const msg = $page?.error?.message || 'empty';
	let headerTxt = `Unexpected Error`;
	let contactTxt = '';

	if ($page.status !== 404) {
		headerTxt = `Page Not Found`;
	} else {
		contactTxt = `Please contact mitchinson.dev@gmail.com to report the error, apologies for the inconvenience.`;
		console.log(`Status: ${status}`);
		console.log(`Error shown on client: ${msg}`);
	}
</script>

<Card>
	<h1 class="text-xl font-bold text-center">{headerTxt}</h1>
	<Break />
	{#if contactTxt}
		<p class="text-center">{contactTxt}</p>
		<Break />
	{/if}
	<div>
		<p>Status: {status}</p>
		<p>Message: {msg}</p>
	</div>
</Card>
