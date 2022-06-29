import React from 'react';
import { ElementProps, Styles } from './types';

function Element(props: ElementProps, ref: React.ForwardedRef<HTMLElement>): React.ReactElement {
	const { children, childKey, childStyles, renderer } = props;
	const childProps = {
		...props,
		key: childKey,
		ref,
	};
	return React.cloneElement(renderer({ style: childStyles as Styles }), childProps, children);
}

const ElementWithRef = React.forwardRef<HTMLElement, ElementProps>(Element);
ElementWithRef.displayName = 'ChildElement';
export default ElementWithRef;
