import React from 'react';
import Element from './Element';
import { ScrollbarPropsWithChildren } from './types';

function VerticalTrackRenderer(
	props: ScrollbarPropsWithChildren,
	ref: React.ForwardedRef<HTMLElement>
) {
	const { children, renderVerticalTrack } = props;
	return (
		<Element ref={ref} childKey={'verticalTrack'} renderer={renderVerticalTrack}>
			{children}
		</Element>
	);
}

const VerticalTrack = React.forwardRef<HTMLElement, ScrollbarPropsWithChildren>(
	VerticalTrackRenderer
);
VerticalTrack.displayName = 'VerticalTrackElement';
export default VerticalTrack;
