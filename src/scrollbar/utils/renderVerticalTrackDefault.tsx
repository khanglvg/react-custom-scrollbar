import React from 'react';
import { ChildRendererParams } from '../types';

export default function renderVerticalTrackDefault({
	style,
	...props
}: ChildRendererParams): JSX.Element {
	const styles = {
		...style,
		right: 2,
		bottom: 2,
		top: 2,
		borderRadius: 3,
	};
	return <div id={'track'} style={styles} {...props} />;
}
