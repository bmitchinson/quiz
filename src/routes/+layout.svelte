<script>
	import '../app.css';
</script>

<div
	class="flex flex-col items-center justify-between h-screen bg-gradient-to-r from-blue-200 to-blue-400 backdrop-blur-md"
>
	<header class="bg-white bg-opacity-70 backdrop-blur-md shadow-lg p-4 w-full">
		<a href="/"><h1 class="text-3xl font-bold text-center">Quiz App</h1></a>
	</header>

	<main>
		<div class="overflow-hidden flex items-center justify-center">
			<slot />
		</div>
	</main>

	<footer class="w-full text-center bg-white text-gray-700 p-3">
		<p>
			For feature requests, access requests, or bug reports, please contact mitchinson.dev@gmail.com
		</p>
		<p>Made w 🩵 in Des Moines 🌽</p>
	</footer>
</div>
