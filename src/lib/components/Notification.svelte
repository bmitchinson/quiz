<script lang="ts">
	export let errorMode = false;
	export let message = '';
	export let notifName = '';
</script>

<div
	id={'notif-' + notifName}
	class={`mb-4 p-4 rounded ${errorMode ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
>
	{message}
</div>
