<script>
	import '../app.css';
</script>

<div class="flex flex-col items-center h-screen justify-between">
	<header class="bg-white bg-opacity-70 backdrop-blur-md shadow-lg p-4 w-full">
		<a href="/"><h1 class="text-3xl font-bold text-center">Quiz App</h1></a>
	</header>

	<main class="flex-grow gap-8 flex items-center justify-center flex-wrap w-full my-8">
		<slot />
	</main>

	<footer class="w-full sticky top-full text-center bg-white text-gray-700 p-3">
		<p>
			For feature requests, access requests, or bug reports, please contact mitchinson.dev@gmail.com
		</p>
		<p>Made w 🩵 in Des Moines 🌽</p>
	</footer>
</div>
