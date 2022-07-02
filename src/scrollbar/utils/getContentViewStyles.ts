import { contentViewStyleDefault } from '../styles';
import getScrollbarWidth from './getScrollbarWidth';

export default function getContentViewStyles(): any {
	const scrollbarWidth = getScrollbarWidth();
	return {
		...contentViewStyleDefault,
		marginRight: scrollbarWidth ? -scrollbarWidth : 0,
		marginBottom: scrollbarWidth ? -scrollbarWidth : 0,
	};
}
