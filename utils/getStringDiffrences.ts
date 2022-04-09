export const findDiff = (correctAns: string, checkAnswer: string) => {
	let diffs = "";
	correctAns.split("").forEach(function (el, index) {
		if (checkAnswer[index] !== el) {
			diffs += `${el},`
		}
	})
	return diffs
}

