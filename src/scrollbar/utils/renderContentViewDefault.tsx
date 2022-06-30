import React from 'react';
import { ChildRendererParams } from 'scrollbar';

export default function renderContentViewDefault(props: ChildRendererParams): JSX.Element {
	return <div {...props} />;
}
