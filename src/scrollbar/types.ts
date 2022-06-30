import React from 'react';

export type Style = { [key: string]: React.CSSProperties };

export type ChildRendererParams = {
	style: Style;
};

export type FunctionalRenderer = (params: ChildRendererParams) => React.ReactElement;

export type Children = React.ReactNode | Array<React.ReactNode>;

export interface IScrollbar {
	scrollTop(top: number): void;
	scrollToBottom(): void;
	scrollToTop(): void;
}

export type ScrollbarProps = {
	children?: React.ReactNode;
	containerStyle?: Style;
	containerTagName?: 'div';
	onScroll?(event: React.UIEvent<HTMLElement>): void;
	renderContentView?: FunctionalRenderer;
	renderVerticalThumb?: FunctionalRenderer;
	renderVerticalTrack?: FunctionalRenderer;
};

export type ScrollbarPropsWithChildren = ScrollbarProps & { children: Children };

export type InternalScrollbarProps = {
	containerStyle?: Style;
	containerTagName: 'div';
	renderContentView: FunctionalRenderer;
	renderVerticalThumb: FunctionalRenderer;
	renderVerticalTrack: FunctionalRenderer;
};

export type InternalScrollbarPropsWithChildren = InternalScrollbarProps & { children: Children };

export type ContainerProps = InternalScrollbarPropsWithChildren;

export type ElementProps = {
	childStyle?: Style;
	childKey?: string;
	children?: Children;
	renderer: FunctionalRenderer;
};

export type VerticalThumbProps = Pick<InternalScrollbarPropsWithChildren, 'renderVerticalThumb'> &
	Partial<ChildRendererParams>;

export type VerticalTrackProps = Pick<
	InternalScrollbarPropsWithChildren,
	'renderVerticalTrack' | 'children'
> &
	Partial<ChildRendererParams>;

export type ContentViewProps = Pick<
	InternalScrollbarPropsWithChildren,
	'renderContentView' | 'children'
> &
	Partial<ChildRendererParams> & {
		onScroll(event: React.UIEvent<HTMLElement>): void;
	};
