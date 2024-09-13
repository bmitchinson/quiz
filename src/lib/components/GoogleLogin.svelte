<!-- src/lib/components/GoogleLogin.svelte -->
<script>
	import { onMount } from 'svelte';
	import { jwtDecode } from 'jwt-decode';

	// Replace with your actual Client ID
	const CLIENT_ID = '63777147520-i46ut70cdcb42kgrr9sf4sfjqpupaimp.apps.googleusercontent.com';

	// Function to handle the credential response
	function handleCredentialResponse(response) {
		try {
			const decoded = jwtDecode(response.credential);
			const userEmail = decoded.email;
			document.getElementById('email').innerText = 'Email: ' + userEmail;
			console.log('User Email:', userEmail);
			// You can dispatch an event or update a store with the user info
			// For example:
			// dispatch('login', { email: userEmail });
			// alert(`Logged in as: ${userEmail}`);
		} catch (error) {
			console.error('Error decoding JWT:', error);
		}
	}

	onMount(() => {
		// Load the Google Identity Services script
		const script = document.createElement('script');
		script.src = 'https://accounts.google.com/gsi/client';
		script.async = true;
		script.defer = true;
		document.body.appendChild(script);

		script.onload = () => {
			// Initialize the Google Sign-In
			google.accounts.id.initialize({
				client_id: CLIENT_ID,
				callback: handleCredentialResponse
			});

			// Render the Google Sign-In button
			google.accounts.id.renderButton(
				document.getElementById('g_id_signin'),
				{ theme: 'outline', size: 'large' } // customization attributes
			);

			// Optionally, prompt the user to select an account
			google.accounts.id.prompt();
		};

		// Cleanup the script when component is destroyed
		return () => {
			document.body.removeChild(script);
		};
	});
</script>

<!-- Container for the Google Sign-In button -->
<div class="flex items-center justify center">
	<div id="g_id_signin"></div>
</div>
