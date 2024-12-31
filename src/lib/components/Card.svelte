<script>
	export let additionalClasses = '';
	export let id = '';

	export let colMode = true;
	let rowOrCol = colMode ? 'flex-col space-y-4' : 'flex-row space-x-4';
</script>

<div
	{id}
	class={'custom-card flex space-4 bg-white rounded-lg p-8 shadow-lg ' +
		additionalClasses +
		' ' +
		rowOrCol}
>
	<slot></slot>
</div>
