import React from 'react';
import { Element } from '../components';
import { ScrollbarPropsWithChildren } from '../types';

function ContentRenderer(
	props: ScrollbarPropsWithChildren,
	ref: React.ForwardedRef<HTMLElement>
) {
	const { children, renderViewContainer } = props;
	return (
		<Element ref={ref} childKey={'contentView'} renderer={renderViewContainer}>
			{children}
		</Element>
	);
}

const Content = React.forwardRef<HTMLElement, ScrollbarPropsWithChildren>(
	ContentRenderer
);
Content.displayName = 'ContentView';
export default Content;
