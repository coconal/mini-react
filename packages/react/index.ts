// packages/react/index.ts
import currentDispatcher, {
	Dispatcher,
	resolveDispatcher
} from './src/currentDispatcher';
import { ReactContext } from '../shared/ReactTypes';
import {
	REACT_CONTEXT_TYPE,
	REACT_PROVIDER_TYPE
} from '../shared/ReactSymbols';
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

export const createContext = <T>(defaultValue: T): ReactContext<T> => {
	const context: ReactContext<T> = {
		$$typeof: REACT_CONTEXT_TYPE,
		_currentValue: defaultValue,
		Provider: null,
		Consumer: null
	};
	context.Provider = {
		$$typeof: REACT_PROVIDER_TYPE,
		_context: context
	};
	return context;
};

export const useContext: Dispatcher['useContext'] = (context) => {
	const dispatcher = resolveDispatcher();
	return dispatcher.useContext(context);
};

// 内部数据共享层
export const __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = {
	currentDispatcher
};

export default {
	version: '1.0.0',
	createElement: jsx
};
