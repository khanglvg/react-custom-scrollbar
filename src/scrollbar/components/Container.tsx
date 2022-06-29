import React from 'react';
import { ContainerProps } from './types';

function ContainerElement(
	props: ContainerProps,
	ref: React.ForwardedRef<HTMLElement>
): React.ReactElement {
	const { children, containerStyles, outerTagName = 'div' } = props;
	const containerProps = {
		...props,
		style: containerStyles,
		ref,
	};
	return React.createElement(outerTagName, containerProps, children);
}

const Container = React.forwardRef<HTMLElement, ContainerProps>(ContainerElement);
Container.displayName = 'ContainerElement';
export default Container;
