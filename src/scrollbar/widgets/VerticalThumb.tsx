import React from 'react';
import { Element } from '../components';
import { VerticalThumbProps } from '../types';

function VerticalThumbRenderer(props: VerticalThumbProps, ref: React.ForwardedRef<HTMLElement>) {
	const { renderVerticalThumb, style, ...otherProps } = props;
	return <Element {...otherProps} ref={ref} childStyle={style} renderer={renderVerticalThumb} />;
}

const VerticalThumb = React.forwardRef<HTMLElement, VerticalThumbProps>(VerticalThumbRenderer);
VerticalThumb.displayName = 'VerticalThumbElement';
export default VerticalThumb;
