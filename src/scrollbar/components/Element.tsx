import React from 'react';
import { ElementProps, Style } from '../types';

function ElementRenderer(
	props: ElementProps,
	ref: React.ForwardedRef<HTMLElement>
): React.ReactElement {
	const { children, childKey, childStyle, renderer, ...otherProps } = props;
	const childProps = {
		...otherProps,
		key: childKey,
		ref,
	};
	return React.cloneElement(renderer({ style: childStyle as Style }), childProps, children);
}

const Element = React.forwardRef<HTMLElement, ElementProps>(ElementRenderer);
Element.displayName = 'Element';
export default Element;
