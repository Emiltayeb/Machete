export const findDiff = (correctAns: string, checkAnswer: string) => {
	let diffs = "";
	correctAns.split("").forEach(function (el, index) {
		if (checkAnswer?.[index]?.toLocaleLowerCase?.() !== el.toLowerCase?.()) {
			diffs += `${el},`
		}
	})
	return diffs
}

