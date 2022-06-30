import React from 'react';
import { Container } from './components';
import {
	FunctionalRenderer,
	InternalScrollbarProps,
	IScrollbar,
	ScrollbarProps,
	ScrollbarPropsWithChildren,
	Style,
} from './types';
import { ContentView, VerticalThumb, VerticalTrack } from './widgets';
import {
	getContainerStyles,
	getContentViewStyles,
	getVerticalTrackStyles,
	getVerticalThumbStyles,
	renderContentViewDefault,
	renderVerticalThumbDefault,
	renderVerticalTrackDefault,
} from './utils';

function getContentView(
	props: ScrollbarPropsWithChildren,
	ref: React.Ref<HTMLElement>
): JSX.Element {
	let { children, renderContentView } = props;
	if (!renderContentView) {
		renderContentView = renderContentViewDefault;
	}
	const contentViewStyles = getContentViewStyles();
	return (
		<ContentView ref={ref} renderContentView={renderContentView} style={contentViewStyles}>
			{children}
		</ContentView>
	);
}

function getVerticalTrackElement(
	props: {
		renderVerticalThumb?: FunctionalRenderer;
		renderVerticalTrack?: FunctionalRenderer;
	},
	ref: React.Ref<HTMLElement>
): JSX.Element {
	let { renderVerticalThumb, renderVerticalTrack } = props;

	if (!renderVerticalTrack) {
		renderVerticalTrack = renderVerticalTrackDefault;
	}
	if (!renderVerticalThumb) {
		renderVerticalThumb = renderVerticalThumbDefault;
	}

	const verticalThumbStyles = getVerticalThumbStyles();
	const verticalTrackStyles = getVerticalTrackStyles();

	return (
		<VerticalTrack ref={ref} renderVerticalTrack={renderVerticalTrack} style={verticalTrackStyles}>
			<VerticalThumb renderVerticalThumb={renderVerticalThumb} style={verticalThumbStyles} />
		</VerticalTrack>
	);
}

class Scrollbar extends React.Component<ScrollbarProps> implements IScrollbar {
	static defaultProps: ScrollbarProps = {
		containerTagName: 'div',
	};

	constructor(props: ScrollbarProps) {
		super(props);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
		this.scrollTop = this.scrollTop.bind(this);
	}

	private contentViewRef: HTMLElement | null = null;
	private verticalTrackRef: HTMLElement | null = null;

	scrollToTop() {}

	scrollTop() {}

	scrollToBottom() {}

	render() {
		const {
			children,
			containerStyle,
			containerTagName,
			onScroll,
			renderContentView,
			renderVerticalThumb,
			renderVerticalTrack,
			...otherProps
		} = this.props;
		const contentView = getContentView({ children, renderContentView, ...otherProps }, (ref) => {
			this.contentViewRef = ref;
		});

		/**
		 * Vertical
		 */
		const verticalTrackElement = getVerticalTrackElement(
			{ renderVerticalThumb, renderVerticalTrack },
			(ref) => {
				this.verticalTrackRef = ref;
			}
		);

		const containerStyles = {
			...getContainerStyles(),
			containerStyle,
		};

		return (
			<Container {...(this.props as InternalScrollbarProps)} containerStyle={containerStyles}>
				{[contentView, verticalTrackElement]}
			</Container>
		);
	}
}

export default Scrollbar;
