(async () => {
	const frameworksResponse = await fetch('http://127.0.0.1:5000/frameworks');
	const langsResponse = await fetch('http://127.0.0.1:5000/langs');
	let langList = [];
	let frameworkList = [];
	if (frameworksResponse.ok) {
		frameworkList = await frameworksResponse.json();
	}
	if (langsResponse.ok) {
		langList = await langsResponse.json();
	}

	console.log(langList);
	console.log(frameworkList);

	const selectElement = document.getElementById('requestType');
	selectElement.addEventListener('change', changeOptions);

	let selectedList;
	function changeOptions() {
		// Get the selected value
		const selectedValue = selectElement.value;

		switch (selectedValue) {
			case 'langs':
				selectedList = langList.map((e) => e.name);
				break;
			case 'frameworks':
				selectedList = frameworkList.map((e) => e.name);
				break;
		}

		const requestOption = document.getElementById('requestOption');

		for (let child of Array.from(requestOption.children)) {
			requestOption.removeChild(child);
		}

		let index = 0;
		for (let obj of selectedList) {
			const el = document.createElement('option');
			el.textContent = obj;
			el.value = index.toString();
			requestOption.appendChild(el);

			index++;
		}
	}

	changeOptions();

	document.getElementById('sendRequest').addEventListener('click', () => {
		const type = document.getElementById('requestType').selectedIndex;
		const langIndex =
			document.getElementById('requestOption').selectedIndex;

		let value;

		if (type == 0) {
			value = langList[langIndex].id;
		} else {
			value = frameworkList[langIndex].id;
		}

		const url = `${document.location.href.replace('index.html', 'info.html')}#/${type == 1 ? 'frameworks' : 'langs'}/${value}`;
		console.log(url);
		window.open(url);
	});
})();
