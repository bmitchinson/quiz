<script>
	import { makePostRequest } from '$lib/apiUtils';
	import Card from '$lib/components/Card.svelte';
	import DrawingCanvas from '$lib/components/DrawingCanvas.svelte';

	export let data;
	const { secondsToDraw, accessCode } = data;
	let canvas;
	let drawingSubmitted = false;

	function submitImage() {
		const conf = window.confirm('Submit your drawing?');
		if (conf) {
			makePostRequest(
				'/api/drawing',
				{
					jpgBase64: canvas.toDataURL('image/jpeg', 0.15),
					accessCode
				},
				(data) => {
					if (data.success) {
						drawingSubmitted = true;
						// TODO: canvasHasBeenDrawedOn is true, need to set to false
						// TODO: Need to autoload drawingSubmitted on page load
					} else {
						alert('Failed to submit drawing. Please try again.');
					}
				},
				(err) => {
					console.error(err);
					alert('Failed to submit drawing. Please try again.');
				}
			);
			// await prisma.image.create({ data: { data: buffer } });
		}
	}
</script>

<svelte:head>
	<title>Student: Drawing</title>
</svelte:head>

{#if drawingSubmitted}
	<Card>
		<h1>Your drawing has been submitted! ✅</h1>
	</Card>
{:else}
	<div class="container">
		<h1>{secondsToDraw}</h1>
		<DrawingCanvas bind:canvas />

		<button class="tool-button" on:click={submitImage}>Submit</button>
	</div>
{/if}

<style>
	.container {
		text-align: center;
		margin-top: 20px;
	}

	.tool-button {
		padding: 8px 15px;
		margin: 5px;
		border: none;
		border-radius: 20px;
		background-color: #ffd700;
		cursor: pointer;
		font-size: 16px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.tool-button:hover {
		background-color: #ffc107;
	}
</style>
