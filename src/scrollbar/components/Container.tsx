import React from 'react';
import { ContainerProps } from '../types';

function ContainerRenderer(
	props: ContainerProps,
	ref: React.ForwardedRef<HTMLElement>
): React.ReactElement {
	const { children, containerStyle, containerTagName = 'div', ...otherProps } = props;
	const containerProps = {
		...otherProps,
		style: containerStyle,
		ref,
	};
	return React.createElement(containerTagName, containerProps, children);
}

const Container = React.forwardRef<HTMLElement, ContainerProps>(ContainerRenderer);
Container.displayName = 'Container';
export default Container;
