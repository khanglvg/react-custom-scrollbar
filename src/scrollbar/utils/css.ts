/**
 * Fork from https://github.com/mattdesl/dom-css
 */

import addPxToStyle from './addPxToStyle';

type Dict<T> = {
	[key: string]: T;
};

let cache: Dict<string> = { float: 'cssFloat' };
let div: HTMLDivElement | null = null;
const prefixes = ['Webkit', 'Moz', 'O', 'ms'];

function toSpaceCase(string: string): string {
	return string
		.toLowerCase()
		.replace(/[\W_]+(.|$)/g, function (matches, match) {
			return match ? ' ' + match : '';
		})
		.trim();
}

function toCamelCase(string: string): string {
	return toSpaceCase(string).replace(/\s(\w)/g, function (matches, letter) {
		return letter.toUpperCase();
	});
}

function prefix(prop: string): string {
	// re-use a dummy div
	if (!div) {
		div = document.createElement('div');
	}

	const style = div.style;

	// prop exists without prefix
	if (prop in style) {
		return prop;
	}

	// borderRadius -> BorderRadius
	const titleCase = prop.charAt(0).toUpperCase() + prop.slice(1);

	// find the vendor-prefixed prop
	for (let i = prefixes.length; i >= 0; i--) {
		const name = prefixes[i] + titleCase;
		// e.g. WebkitBorderRadius or webkitBorderRadius
		if (name in style) {
			return name;
		}
	}

	return '';
}

function detect(cssProp: string) {
	const camel = toCamelCase(cssProp);
	let result = prefix(camel);
	cache[camel] = cache[cssProp] = cache[result] = result;
	return result;
}

function style(element: HTMLElement, property: string, value?: string) {
	let camel = cache[property];
	if (typeof camel === 'undefined') {
		camel = detect(property);
	}

	// may be false if CSS prop is unsupported
	if (camel) {
		if (value === undefined) {
			// @ts-ignore
			return element.style[camel];
		}

		// @ts-ignore
		element.style[camel] = addPxToStyle(camel, value);
	}
}

function each(element: HTMLElement, properties: Dict<string>): void {
	for (let k in properties) {
		if (Object.prototype.hasOwnProperty.call(properties, k)) {
			style(element, k, properties[k]);
		}
	}
}

function get(element: HTMLElement, properties: Array<any> | string) {
	if (Array.isArray(properties)) {
		return properties.reduce(function (obj, prop) {
			obj[prop] = style(element, prop || '');
			return obj;
		}, {});
	} else {
		return style(element, properties || '');
	}
}

function set(
	element: HTMLElement,
	properties: Dict<string | number> | string,
	value?: string
): void {
	if (arguments.length === 2) {
		if (typeof arguments[1] === 'string') {
			arguments[0].style.cssText = arguments[1];
		} else {
			each(arguments[0], arguments[1]);
		}
	} else {
		style(arguments[0], arguments[1], arguments[2]);
	}
}

const css = set;
css.prototype.get = get;
css.prototype.set = set;

export default css;
