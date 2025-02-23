(async () => {
	console.log(document.location.href);
	const arr = document.location.href.split('/').slice(-2);
	if (!arr.find((e) => e.includes('.html'))) {
		const endpoint = arr.join('/');

		const response = await fetch(`http://127.0.0.1:5000/${endpoint}`);

		if (response.ok) {
			const json = await response.text();
			console.log(json);
			document.getElementById('content').textContent = json;
		}
	}
})();
