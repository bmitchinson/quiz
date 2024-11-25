<script>
	export let additionalClasses = '';
	export let id = '';
</script>

<div
	{id}
	class={'custom-card flex flex-col space-y-4 bg-white rounded-lg p-8 shadow-lg ' +
		additionalClasses}
>
	<slot></slot>
</div>
