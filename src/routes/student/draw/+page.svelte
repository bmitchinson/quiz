<script>
	import { onMount } from 'svelte';

	let canvas;
	let ctx;
	let isDrawing = false;
	let x = 0;
	let y = 0;
	let color = '#000000';
	let lineWidth = 5;
	let isErasing = false;
	let cursorX = 0;
	let cursorY = 0;
	let showCursorIndicator = false;

	const colors = [
		'#FF0000', // Red
		'#FFA500', // Orange
		'#FFFF00', // Yellow
		'#008000', // Green
		'#0000FF', // Blue
		'#800080', // Purple
		'#A52A2A', // Brown
		'#FFC0CB' // Pink
	];

	function startDrawing(event) {
		isDrawing = true;
		[x, y] = getPosition(event);
	}

	function stopDrawing() {
		isDrawing = false;
	}

	function draw(event) {
		[cursorX, cursorY] = getPosition(event);

		if (!isDrawing) return;

		ctx.beginPath();
		ctx.moveTo(x, y);
		[x, y] = [cursorX, cursorY];
		ctx.lineTo(x, y);
		ctx.strokeStyle = isErasing ? '#FFFFFF' : color;
		ctx.lineWidth = lineWidth;
		ctx.lineCap = 'round';
		ctx.stroke();
		ctx.closePath();
	}

	function getPosition(event) {
		const rect = canvas.getBoundingClientRect();
		const clientX = event.touches ? event.touches[0].clientX : event.clientX;
		const clientY = event.touches ? event.touches[0].clientY : event.clientY;
		return [clientX - rect.left, clientY - rect.top];
	}

	function selectColor(selectedColor) {
		color = selectedColor;
		isErasing = false;
	}

	function erase() {
		isErasing = true;
	}

	function saveImage() {
		const link = document.createElement('a');
		link.download = 'my_drawing.png';
		link.href = canvas.toDataURL();
		link.click();
	}

	function updateCursor(event) {
		const rect = canvas.getBoundingClientRect();
		cursorX = event.clientX - rect.left;
		cursorY = event.clientY - rect.top;
		showCursorIndicator = true;
	}

	function hideCursor() {
		showCursorIndicator = false;
	}

	onMount(() => {
		ctx = canvas.getContext('2d');
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
	});

	function resizeCanvas() {
		const { width, height } = canvas.getBoundingClientRect();
		canvas.width = width;
		canvas.height = height;
		ctx.fillStyle = '#FFFFFF';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}
</script>

<div class="container">
	<div
		class="canvas-container"
		role="application"
		on:mousemove={updateCursor}
		on:mouseleave={hideCursor}
		on:touchmove|preventDefault={updateCursor}
		on:touchend|preventDefault={hideCursor}
	>
		<canvas
			bind:this={canvas}
			on:mousedown={startDrawing}
			on:mouseup={stopDrawing}
			on:mouseleave={stopDrawing}
			on:mousemove={draw}
			on:touchstart|preventDefault={startDrawing}
			on:touchend|preventDefault={stopDrawing}
			on:touchmove|preventDefault={draw}
		></canvas>
		{#if showCursorIndicator}
			<div
				class="cursor-indicator"
				style="
          width: {lineWidth}px;
          height: {lineWidth}px;
          top: {cursorY}px;
          left: {cursorX}px;
        "
			></div>
		{/if}
	</div>

	<div class="controls">
		{#each colors as c}
			<button
				type="button"
				class="color-button {color === c && !isErasing ? 'selected' : ''}"
				style="background-color: {c};"
				on:click={() => selectColor(c)}
				aria-label="Select color {c}"
			></button>
		{/each}
		<button class="tool-button" on:click={erase}>Erase</button>
		<button class="tool-button" on:click={saveImage}>Save</button>
	</div>

	<div class="slider-container">
		<label for="lineWidth">Brush Size: {lineWidth}</label>
		<input type="range" id="lineWidth" min="1" max="50" bind:value={lineWidth} />
	</div>
</div>

<style>
	.container {
		text-align: center;
		margin-top: 20px;
	}

	.canvas-container {
		display: inline-block;
		position: relative;
		width: 80%;
		max-width: 800px;
	}

	canvas {
		width: 100%;
		height: auto;
		border-radius: 20px;
		box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
		background-color: #ffffff;
		touch-action: none;
	}

	.cursor-indicator {
		position: absolute;
		border: 1px solid rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		pointer-events: none;
		transform: translate(-50%, -50%);
		background-color: rgba(0, 0, 0, 0.1);
	}

	.controls {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-top: 10px;
		flex-wrap: wrap;
	}

	.color-button {
		width: 35px;
		height: 35px;
		margin: 5px;
		border-radius: 50%;
		border: 2px solid #fff;
		cursor: pointer;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
	}

	.color-button.selected {
		border-color: #000;
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

	.slider-container {
		margin-top: 10px;
	}

	.slider-container label {
		font-size: 16px;
		margin-right: 10px;
	}

	.slider-container input[type='range'] {
		width: 200px;
	}
</style>
