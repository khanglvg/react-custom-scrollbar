import React from 'react';

export type FunctionalRenderer = (params: ChildRendererParams) => React.ReactElement;

export type Styles = { [key: string]: React.CSSProperties };

export type Children = Array<React.ReactNode>;

export interface IScrollbar {
	scrollTop(top: number): void;
	scrollToBottom(): void;
	scrollToTop(): void;
}

export type ScrollbarProps = {
	containerStyles?: Styles;
	outerTagName: 'div';
	renderVerticalThumb: FunctionalRenderer;
	renderVerticalTrack: FunctionalRenderer;
};

export type ScrollbarPropsWithChildren = ScrollbarProps & { children: Children };

export type ContainerProps = ScrollbarPropsWithChildren;

export type ChildRendererParams = {
	style: Styles;
};

export type ElementProps = {
	childStyles?: Styles;
	childKey?: string;
	children?: Children;
	renderer: FunctionalRenderer;
};
