// packages/react/src/currentDispatcher.ts
import { Action } from 'shared/ReactTypes';

// const [data, setData] = useState(0);
// or
// const [data, setData] = useState(0data) => data + 1);
export interface Dispatcher {
	useState: <S>(initialState: (() => S) | S) => [S, Dispatch<S>];
	useEffect: (callback: () => void | void, deps: any[] | void) => void;
	useMemo: <S>(callback: () => S, deps: any[] | null) => S;
	useCallback: <S>(callback: S, deps: any[] | null) => S;
	useReducer: <S, I, A>(
		reducer: (s: S, action: A) => S,
		initialArg: I,
		init?: (initial: I) => S
	) => [S, Dispatch<S>];
}

export type Dispatch<State> = (action: Action<State>) => void;

const currentDispatcher: { current: Dispatcher | null } = {
	current: null
};

export const resolveDispatcher = (): Dispatcher => {
	const dispatcher = currentDispatcher.current;
	if (dispatcher == null) {
		throw new Error('Hooks 只能在函数组件中执行');
	}
	return dispatcher;
};

export default currentDispatcher;
