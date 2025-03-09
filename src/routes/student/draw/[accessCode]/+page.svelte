<script>
	import DrawingCanvas from '$lib/components/DrawingCanvas.svelte';

	export let data;
	const { secondsToDraw } = data;
	let canvas;

	function saveImage() {
		const link = document.createElement('a');
		link.download = 'my_drawing.jpg';
		link.href = canvas.toDataURL('image/jpeg', 0.15);
		link.click();
	}
</script>

<svelte:head>
	<title>Student: Drawing</title>
</svelte:head>

<div class="container">
	<h1>{secondsToDraw}</h1>
	<DrawingCanvas bind:canvas />

	<button class="tool-button" on:click={saveImage}>Save</button>
</div>

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
