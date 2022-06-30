import React from 'react';
import { Element } from '../components';
import { VerticalTrackProps } from '../types';

function VerticalTrackRenderer(props: VerticalTrackProps, ref: React.ForwardedRef<HTMLElement>) {
	const { children, renderVerticalTrack, style, ...otherProps } = props;
	return (
		<Element
			ref={ref}
			childKey={'verticalTrack'}
			childStyle={style}
			renderer={renderVerticalTrack}
			{...otherProps}
		>
			{children}
		</Element>
	);
}

const VerticalTrack = React.forwardRef<HTMLElement, VerticalTrackProps>(VerticalTrackRenderer);
VerticalTrack.displayName = 'VerticalTrackElement';
export default VerticalTrack;
