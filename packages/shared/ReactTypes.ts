export type Type = any;
export type Key = any;
export type Props = any;
export type Ref = any;
export type ElementType = any;

export interface ReactElementType {
	$$typeof: symbol | number;
	key: Key;
	props: Props;
	ref: Ref;
	type: ElementType;
	__mark: string;
}

export type Action<State> = State | ((prevState: State) => State);

export type ReactContext<T> = {
	$$typeof: symbol | number;
	_currentValue: T;
	Provider: ReactProviderType<T> | null;
	Consumer: ReactContext<T> | null;
};

export type ReactProviderType<T> = {
	$$typeof: symbol | number;
	_context: ReactContext<T>;
};
