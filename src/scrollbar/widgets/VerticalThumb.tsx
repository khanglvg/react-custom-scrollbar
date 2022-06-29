import React from 'react';
import Element from './Element';
import { ScrollbarProps } from './types';

function VerticalThumbRenderer(props: ScrollbarProps, ref: React.ForwardedRef<HTMLElement>) {
	const { renderVerticalThumb } = props;
	return <Element ref={ref} renderer={renderVerticalThumb} />;
}

const VerticalThumb = React.forwardRef<HTMLElement, ScrollbarProps>(VerticalThumbRenderer);
VerticalThumb.displayName = 'VerticalThumbElement';
export default VerticalThumb;
