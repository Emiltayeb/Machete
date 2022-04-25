export const findDiff = (correctAns: string, checkAnswer: string) => {
	let diffs = "";
	correctAns.split("").forEach(function (el, index) {
		if (checkAnswer[index] !== el) {
			diffs += `${el},`
		}
	})
	return diffs
}

export const appendQueryToUrl = function (query: any) {
	const queryString = new URLSearchParams(window.location.search);
	const keys = Object.keys(query)
	keys.map(key => queryString.set(key, query[key]))
	window.history.pushState({}, "", `${window.location.pathname}?${queryString.toString()}`)
}

export const shuffleArray = (array: any[]) => array.sort(() => Math.random() - 0.5)

export const isMobile = function () {
	return window.matchMedia('(max-width: 760px)').matches;
}

