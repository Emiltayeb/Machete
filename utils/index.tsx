export const isMobile = function () {
	return window.matchMedia('(max-width: 760px)').matches;
}