function raf(callback: FrameRequestCallback): number {
	return window.requestAnimationFrame(callback);
}

function caf(requestId: number): void {
	return window.cancelAnimationFrame(requestId);
}

export { raf, caf };
