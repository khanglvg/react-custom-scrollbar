import React, { ForwardRefExoticComponent } from 'react';
import ContainerElement from './Container';
import Element from './Element';
import { IScrollbar, ScrollbarProps, ScrollbarPropsWithChildren } from './types';

function VerticalThumbElement(): ForwardRefExoticComponent<ScrollbarProps> {
	const Component = React.forwardRef(
		(props: ScrollbarProps, ref: React.ForwardedRef<HTMLElement>) => {
			const { renderVerticalThumb } = props;
			return <Element ref={ref} renderer={renderVerticalThumb} />;
		}
	);
	Component.displayName = 'VerticalThumbElement';
	return Component;
}

function VerticalTrackElement(): ForwardRefExoticComponent<ScrollbarPropsWithChildren> {
	const Component = React.forwardRef(
		(props: ScrollbarPropsWithChildren, ref: React.ForwardedRef<HTMLElement>) => {
			const { children, renderVerticalTrack } = props;
			return (
				<Element ref={ref} childKey={'verticalTrack'} renderer={renderVerticalTrack}>
					{children}
				</Element>
			);
		}
	);
	Component.displayName = 'VerticalTrackElement';
	return Component;
}

class Scrollbar extends React.Component<ScrollbarProps> implements IScrollbar {
	constructor(props: ScrollbarProps) {
		super(props);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
		this.scrollTop = this.scrollTop.bind(this);
	}

	scrollToTop() {}

	scrollTop() {}

	scrollToBottom() {}

	render() {
		const verticalTrackElement = (
			<VerticalTrackElement {...this.props}>
				<VerticalThumbElement {...this.props} />
			</VerticalTrackElement>
		);
		return <ContainerElement children={[verticalTrackElement]} {...this.props} />;
	}
}

export default Scrollbar;
