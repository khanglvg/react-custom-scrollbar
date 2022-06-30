export default function getInnerHeight(element: HTMLElement): number {
	const { clientHeight } = element;
	const { paddingTop, paddingBottom } = getComputedStyle(element);
	return clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
}
