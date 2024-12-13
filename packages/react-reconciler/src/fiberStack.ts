const valueStack: Array<any> = [];

let index = -1;

export type StackCursor<T> = { current: T };

// cursor 记录栈顶元素
function createCursor<T>(defaultValue: T): StackCursor<T> {
	return {
		current: defaultValue
	};
}

function isEmpty(): boolean {
	return index === -1;
}

function pop<T>(cursor: StackCursor<T>): void {
	if (index < 0) {
		if (__DEV__) {
			console.error('Unexpected pop.');
		}
		return;
	}

	cursor.current = valueStack[index];

	valueStack[index] = null;

	index--;
}

function push<T>(cursor: StackCursor<T>, value: T): void {
	index++;

	valueStack[index] = cursor.current;

	cursor.current = value;
}

export { createCursor, isEmpty, pop, push };
