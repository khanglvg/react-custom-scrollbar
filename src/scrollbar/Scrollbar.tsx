import React from 'react';
import { Container } from './components';
import {
	FunctionalRenderer,
	InternalScrollbarProps,
	IScrollbar,
	ScrollbarProps,
	ScrollbarPropsWithChildren,
} from './types';
import { ContentView, VerticalThumb, VerticalTrack } from './widgets';
import {
	caf,
	css,
	getContainerStyles,
	getContentViewStyles,
	getInnerHeight,
	getScrollbarWidth,
	getVerticalTrackStyles,
	getVerticalThumbStyles,
	raf,
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

	private contentViewRef: HTMLElement | null = null;
	private requestId: number | null;
	private verticalTrackRef: HTMLElement | null = null;

	constructor(props: ScrollbarProps) {
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
		this.scrollTop = this.scrollTop.bind(this);
	}

	handleScroll(event: React.UIEvent<HTMLElement>): void {
		const { onScroll } = this.props;
		if (onScroll) {
			onScroll(event);
		}
		if (!this.contentViewRef) return;
		const { scrollHeight, clientHeight, scrollTop } = this.contentViewRef;
		console.log(
			`KDebug 🚩 Scrollbar - 94 ~ handleScroll -> `,
			clientHeight,
			scrollHeight,
			scrollTop
		);
		this.update(() => {
			console.log('kdebug update done');
		});
		/**
		 TODO:
		 1/ Update thumb height
		 2/ Update thumb position
		 */
	}

	scrollToTop() {}

	scrollTop() {}

	scrollToBottom() {}

	getThumbVerticalHeight(): number {
		const { thumbSize, thumbMinSize } = this.props;
		const { scrollHeight, clientHeight } = this.contentViewRef as HTMLElement;
		const trackHeight = getInnerHeight(this.verticalTrackRef as HTMLElement);
		const height = Math.ceil((clientHeight / scrollHeight) * trackHeight);
		if (trackHeight === height) return 0;
		if (thumbSize) return thumbSize;
		return Math.max(height, thumbMinSize);
	}

	getValues() {
		const {
			scrollLeft = 0,
			scrollTop = 0,
			scrollWidth = 0,
			scrollHeight = 0,
			clientWidth = 0,
			clientHeight = 0,
		} = this.contentViewRef || {};

		return {
			left: scrollLeft / (scrollWidth - clientWidth) || 0,
			top: scrollTop / (scrollHeight - clientHeight) || 0,
			scrollLeft,
			scrollTop,
			scrollWidth,
			scrollHeight,
			clientWidth,
			clientHeight,
		};
	}

	doOnNextFrame(callback: FrameRequestCallback): void {
		if (this.requestId) {
			caf(this.requestId);
		}
		this.requestId = raf(callback);
	}

	doUpdate(callback: Function): void {
		const { onUpdate, hideTracksWhenNotNeeded } = this.props;
		const values = this.getValues();
		if (getScrollbarWidth()) {
			const { clientWidth, scrollWidth } = values;
			const { scrollTop, clientHeight, scrollHeight } = values;
			const trackVerticalHeight = getInnerHeight(this.verticalTrackRef as HTMLElement);
			const thumbVerticalHeight = this.getThumbVerticalHeight();
			const thumbVerticalY =
				(scrollTop / (scrollHeight - clientHeight)) * (trackVerticalHeight - thumbVerticalHeight);
			const thumbVerticalStyle = {
				height: thumbVerticalHeight,
				transform: `translateY(${thumbVerticalY}px)`,
			};
			if (hideTracksWhenNotNeeded) {
				const trackVerticalStyle = {
					visibility: scrollHeight > clientHeight ? 'visible' : 'hidden',
				};
				css(this.verticalTrackRef as HTMLElement, trackVerticalStyle);
			}
			console.log('kdebug', thumbVerticalStyle);
			css(this.verticalTrackRef as HTMLElement, thumbVerticalStyle);
		}
		if (onUpdate) onUpdate(values);
		if (typeof callback === 'function') callback(values);
	}

	update(callback: Function) {
		this.doOnNextFrame(() => {
			this.doUpdate(callback);
		});
	}

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
