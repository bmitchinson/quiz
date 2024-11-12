<script>
	export let additionalClasses = '';
</script>

<div
	class={'custom-card flex flex-col space-y-4 bg-white rounded-lg p-8 shadow-lg ' +
		additionalClasses}
>
	<slot></slot>
</div>
