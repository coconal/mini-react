// packages/react/index.ts
import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher';
import { jsx } from './src/jsx';

export const useState: Dispatcher['useState'] = (initialState) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useState(initialState);
};

export const useEffect: Dispatcher['useEffect'] = (creact, deps) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useEffect(creact, deps);
};

export const useMemo: Dispatcher['useMemo'] = (nextCreate, deps) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useMemo(nextCreate, deps);
};

export const useCallback: Dispatcher['useCallback'] = (callback, deps) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useCallback(callback, deps);
};

export const useReducer: Dispatcher['useReducer'] = (
	reduce,
	initialArgs,
	init?
) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useReducer(reduce, initialArgs, init);
};

export const useRef: Dispatcher['useRef'] = (initalValue) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useRef(initalValue);
};

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher
};

export default {
	version: '1.0.0',
	createElement: jsx
};
