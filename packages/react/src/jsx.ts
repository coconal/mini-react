// packages/react/src/jsx.ts
import { REACT_ELEMENT_TYPE } from '../.././shared/ReactSymbols';
import {
	Type,
	Ref,
	Key,
	Props,
	ReactElementType,
	ElementType
} from '../.././shared/ReactTypes';
import { REACT_FRAGMENT_TYPE } from 'shared/ReactSymbols';

export const Fragment = REACT_FRAGMENT_TYPE;

const ReactElement = function (
	type: Type,
	key: Key | null,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: 'erxiao'
	};
	return element;
};

export const jsx = (type: ElementType, config: any, ...children: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	const childrenLength = children.length;
	if (childrenLength) {
		if (childrenLength === 1) {
			props.children = children[0];
		} else {
			props.children = children;
		}
	}
	return ReactElement(type, key, ref, props);
};

export const jsxDEV = (type: ElementType, config: any, maybeKey: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	if (maybeKey !== undefined) {
		key = '' + maybeKey;
	}

	return ReactElement(type, key, ref, props);
};
