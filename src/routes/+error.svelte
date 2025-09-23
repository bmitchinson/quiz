<script lang="ts">
	import { page } from '$app/stores';
	import Break from '$lib/components/Break.svelte';
	import Card from '$lib/components/Card.svelte';

	const status = $page.status;
	const msg = $page?.error?.message || 'empty';
	let headerTxt = `Unexpected Error`;
	let contactTxt = '';
	let contactTxt2 = '';

	if ($page.status !== 404) {
		headerTxt = `Page Not Found`;
	} else {
		contactTxt = `Please report this to mitchinson.dev@gmail.com and wmitchinson@d124.org.`;
		contactTxt2 = `Please include a description of how you encountered this error, what URL is in your browser, and the date/time it occurred.`;
		console.log(`Status: ${status}`);
		console.log(`Error shown on client: ${msg}`);
	}
</script>

<Card>
	<h1 class="text-xl font-bold text-center">{headerTxt}</h1>
	<Break />
	{#if contactTxt}
		<p class="text-center">Apologies for the inconvenience ☹️</p>
		<p class="text-center">{contactTxt}</p>
		<p class="text-center">{contactTxt2}</p>
		<Break />
	{/if}
	<div>
		<p>Status: {status}</p>
		<p>Message: {msg}</p>
	</div>
</Card>
