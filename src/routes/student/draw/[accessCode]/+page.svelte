<script>
	import { makePostRequest } from '$lib/apiUtils';
	import Card from '$lib/components/Card.svelte';
	import DrawingCanvas from '$lib/components/DrawingCanvas.svelte';
	import { getButtonStyles } from '$lib/cssUtils';

	export let data;
	const { secondsToDraw, accessCode, drawingAlreadyExistsBase64 } = data;

	let drawingSubmitted = !!drawingAlreadyExistsBase64;
	let exportedImage = drawingSubmitted ? drawingAlreadyExistsBase64 : '';
	let canvas;

	function submitImage() {
		const conf = window.confirm('Submit your drawing?');
		if (conf) {
			exportedImage = canvas.toDataURL('image/jpeg', 0.5);
			makePostRequest(
				'/api/drawing',
				{
					jpgBase64: exportedImage,
					accessCode
				},
				(data) => {
					if (data.success) {
						drawingSubmitted = true;
					} else {
						alert('Failed to submit drawing. Please try again.');
					}
				},
				(err) => {
					console.error(err);
					alert('Failed to submit drawing. Please try again.');
				}
			);
		}
	}
</script>

<svelte:head>
	<title>Student: Drawing</title>
</svelte:head>

{#if drawingSubmitted}
	<Card additionalClasses={'items-center'}>
		<p>Your drawing has been submitted! ✅</p>
		<img src={exportedImage} class="w-md" alt="drawing" />
		<a class={`${getButtonStyles()}`} href="/">Home</a>
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
