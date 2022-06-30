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
	props: Omit<ScrollbarPropsWithChildren, 'onScroll'> & {
		onScroll(event: React.UIEvent<HTMLElement>): void;
	},
	ref: React.Ref<HTMLElement>
): JSX.Element {
	let { children, onScroll, renderContentView } = props;
	if (!renderContentView) {
		renderContentView = renderContentViewDefault;
	}
	const contentViewStyles = getContentViewStyles();

	return (
		<ContentView
			ref={ref}
			onScroll={onScroll}
			renderContentView={renderContentView}
			style={contentViewStyles}
		>
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
		this.handleScroll = this.handleScroll.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
		this.scrollTop = this.scrollTop.bind(this);
	}

	private contentViewRef: HTMLElement | null = null;
	private verticalTrackRef: HTMLElement | null = null;

	handleScroll(event: React.UIEvent<HTMLElement>): void {
		const { onScroll } = this.props;
		if (onScroll) {
			onScroll(event);
		}
		if (!this.contentViewRef) return;
		const { scrollHeight, clientHeight, scrollTop } = this.contentViewRef;
		console.log(`KDebug 🚩 Scrollbar - 94 ~ handleScroll -> `, clientHeight, scrollHeight, scrollTop);
		/**
		 TODO:
		 1/ Update thumb height
		 2/ Update thumb position
		 */
	}

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

		const contentView = getContentView(
			{ children, renderContentView, onScroll: this.handleScroll, ...otherProps },
			(ref) => {
				this.contentViewRef = ref;
			}
		);

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
