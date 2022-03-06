export const findDiff = (corr: string, sub: string) => {
	//const diffs: Record<string, string> = {}
	let diffs = "";
	corr.split("").forEach(function (el, index) {
		if (sub[index] !== el) {
			diffs += `${el},`
		}
	})
	return diffs
}

