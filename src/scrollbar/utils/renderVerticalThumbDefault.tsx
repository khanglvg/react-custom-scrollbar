import React from 'react';
import { ChildRendererParams } from 'scrollbar';

export default function renderVerticalThumbDefault({
	style,
	...props
}: ChildRendererParams): JSX.Element {
	const styles = {
		...style,
		cursor: 'pointer',
		borderRadius: 'inherit',
		backgroundColor: 'rgba(0,0,0,.2)',
	};
	return <div id={'thumb'} style={styles} {...props} />;
}
