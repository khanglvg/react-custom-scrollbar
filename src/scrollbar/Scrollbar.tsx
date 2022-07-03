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
		onThumbMouseDown?(event: React.MouseEvent<HTMLElement>): void;
		onTrackMouseDown?(event: React.MouseEvent<HTMLElement>): void;
	},
	trackRef: React.Ref<HTMLElement>,
	thumbRef: React.Ref<HTMLElement>
): JSX.Element {
	let { renderVerticalThumb, renderVerticalTrack, onThumbMouseDown, onTrackMouseDown } = props;

	if (!renderVerticalTrack) {
		renderVerticalTrack = renderVerticalTrackDefault;
	}
	if (!renderVerticalThumb) {
		renderVerticalThumb = renderVerticalThumbDefault;
	}

	const verticalThumbStyles = getVerticalThumbStyles();
	const verticalTrackStyles = getVerticalTrackStyles();

	return (
		<VerticalTrack
			ref={trackRef}
			onMouseDown={onTrackMouseDown}
			renderVerticalTrack={renderVerticalTrack}
			style={verticalTrackStyles}
		>
			<VerticalThumb
				ref={thumbRef}
				onMouseDown={onThumbMouseDown}
				renderVerticalThumb={renderVerticalThumb}
				style={verticalThumbStyles}
			/>
		</VerticalTrack>
	);
}

class Scrollbar extends React.Component<ScrollbarProps> implements IScrollbar {
	static defaultProps: ScrollbarProps = {
		containerTagName: 'div',
		minThumbSize: 50,
	};

	private _contentViewRef: HTMLElement | null = null;
	private prevPageY: number = 0;
	private requestId: number | null = null;
	private _verticalThumbRef: HTMLElement | null = null;
	private _verticalTrackRef: HTMLElement | null = null;

	constructor(props: ScrollbarProps) {
		super(props);
		this.handleScroll = this.handleScroll.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
		this.scrollToTop = this.scrollToTop.bind(this);
		this.scrollTop = this.scrollTop.bind(this);
	}

	componentDidMount() {
		this.addEventListeners();
		this.update();
	}

	componentWillUnmount() {
		this.removeEventListeners();
	}

	addEventListeners() {
		window.addEventListener('resize', this.handleResize);
	}

	removeEventListeners() {
		window.removeEventListener('resize', this.handleResize);
	}

	handleResize = () => {
		this.update();
	};

	handleVerticalThumbMouseDown = (
		event: React.MouseEvent<HTMLElement> & { target: HTMLElement }
	) => {
		event.preventDefault();
		// Stop bubbling to track
		event.stopPropagation();
		this.handleDragStart();
		const { target, clientY } = event;
		const { offsetHeight } = target;
		const { top } = target.getBoundingClientRect();
		this.prevPageY = offsetHeight - (clientY - top);
	};

	handleVerticalTrackMouseDown = (
		event: React.MouseEvent<HTMLElement> & { target: HTMLElement }
	) => {
		event.preventDefault();
		const { target, clientY } = event;
		const { top: targetTop } = target.getBoundingClientRect();
		const thumbHeight = this.getThumbVerticalHeight();
		const offset = Math.abs(targetTop - clientY) - thumbHeight / 2;
		this.contentViewRef.scrollTop = this.getScrollTopForOffset(offset);
	};

	handleMouseMove = (event: MouseEvent) => {
		this.handleDrag(event);
	};

	handleMouseUp = () => {
		this.handleDragEnd();
	};

	onContentViewScroll = (event: React.UIEvent<HTMLElement>) => {
		if (!this.contentViewRef) return;
		this.handleScroll(event);
	};

	/**
	 * =============== Drag start ===============
	 */
	handleDragStart() {
		this.registerDragEvent();
	}

	registerDragEvent() {
		document.addEventListener('mousemove', this.handleMouseMove);
		document.addEventListener('mouseup', this.handleMouseUp);
		// Cancel user's selection while dragging
		document.onselectstart = () => false;
	}

	/**
	 * =============== Drag end ===============
	 */
	handleDragEnd() {
		this.teardownRegisteredDragEvent();
	}

	teardownRegisteredDragEvent() {
		document.removeEventListener('mousemove', this.handleMouseMove);
		document.removeEventListener('mouseup', this.handleMouseUp);
		document.onselectstart = null;
	}

	/**
	 * =============== Dragging ===============
	 */
	handleDrag(event: MouseEvent): void {
		if (this.prevPageY) {
			const { clientY } = event;
			const { top: trackTop } = this.verticalTrackRef.getBoundingClientRect();
			const thumbHeight = this.getThumbVerticalHeight();
			const clickPosition = thumbHeight - this.prevPageY;
			const offset = -trackTop + clientY - clickPosition;
			this.contentViewRef.scrollTop = this.getScrollTopForOffset(offset);
		}
	}

	handleScroll(event: React.UIEvent<HTMLElement>): void {
		const { onScroll } = this.props;
		if (onScroll) {
			onScroll(event);
		}
		this.update(() => {
			console.log('kdebug update done');
		});
	}

	scrollToTop() {}

	scrollTop() {}

	scrollToBottom() {}

	getScrollTopForOffset(offset: number) {
		const { scrollHeight, clientHeight } = this.contentViewRef;
		const trackHeight = getInnerHeight(this.verticalTrackRef);
		const thumbHeight = this.getThumbVerticalHeight();
		return (offset / (trackHeight - thumbHeight)) * (scrollHeight - clientHeight);
	}

	getThumbVerticalHeight(): number {
		const { thumbSize, minThumbSize } = this.props;
		const { scrollHeight, clientHeight } = this.contentViewRef;
		const trackHeight = getInnerHeight(this.verticalTrackRef);
		const height = Math.ceil((clientHeight / scrollHeight) * trackHeight);
		if (trackHeight === height) return 0;
		if (thumbSize) return thumbSize;
		return Math.max(height, minThumbSize as number);
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

	doUpdate(callback?: Function): void {
		const { onUpdate, hideTracksWhenNotNeeded } = this.props;
		const values = this.getValues();
		if (getScrollbarWidth()) {
			const { scrollTop, clientHeight, scrollHeight } = values;
			const trackVerticalHeight = getInnerHeight(this.verticalTrackRef);
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
				css(this.verticalTrackRef, trackVerticalStyle);
			}
			css(this.verticalThumbRef, thumbVerticalStyle);
		}
		if (onUpdate) onUpdate(values);
		if (typeof callback === 'function') callback(values);
	}

	update(callback?: Function) {
		this.doOnNextFrame(() => {
			this.doUpdate(callback);
		});
	}

	get contentViewRef(): HTMLElement {
		return this._contentViewRef as HTMLElement;
	}

	get verticalThumbRef(): HTMLElement {
		return this._verticalThumbRef as HTMLElement;
	}

	get verticalTrackRef(): HTMLElement {
		return this._verticalTrackRef as HTMLElement;
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
			{ children, renderContentView, onScroll: this.onContentViewScroll, ...otherProps },
			(ref) => {
				this._contentViewRef = ref;
			}
		);

		/**
		 * Vertical
		 */
		const verticalTrackElement = getVerticalTrackElement(
			{
				renderVerticalThumb,
				renderVerticalTrack,
				onThumbMouseDown: this.handleVerticalThumbMouseDown,
				onTrackMouseDown: this.handleVerticalTrackMouseDown,
			},
			(ref) => {
				this._verticalTrackRef = ref;
			},
			(ref) => {
				this._verticalThumbRef = ref;
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
