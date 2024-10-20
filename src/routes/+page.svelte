<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	export let data;

	onMount(() => {
		if (browser) {
			if (!data.loginType) {
				// Redirect to /login if not logged in
				goto('/login', { replaceState: true });
			} else {
				// Redirect based on loginType
				switch (data.loginType) {
					case 'Admin':
						goto('/admin', { replaceState: true });
						break;
					case 'Student':
						goto('/student/takeQuiz', { replaceState: true });
						break;
					case 'Teacher':
						goto('/teacher', { replaceState: true });
						break;
					default:
						goto('/login', { replaceState: true });
						break;
				}
			}
		}
	});
</script>
