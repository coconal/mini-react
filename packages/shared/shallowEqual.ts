const hasOwnProperty = Object.prototype.hasOwnProperty;

function is(x: any, y: any) {
	return (
		(x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
	);
}

const objectIs: (x: any, y: any) => boolean =
	// $FlowFixMe[method-unbinding]
	typeof Object.is === 'function' ? Object.is : is;

function shallowEqual(objA: any, objB: any): boolean {
	if (is(objA, objB)) {
		return true;
	}

	if (
		typeof objA !== 'object' ||
		objA === null ||
		typeof objB !== 'object' ||
		objB === null
	) {
		return false;
	}

	const keysA = Object.keys(objA);
	const keysB = Object.keys(objB);

	if (keysA.length !== keysB.length) {
		return false;
	}

	// Test for A's keys different from B.
	for (let i = 0; i < keysA.length; i++) {
		const currentKey = keysA[i];
		if (
			!hasOwnProperty.call(objB, currentKey) ||
			// $FlowFixMe[incompatible-use] lost refinement of `objB`
			!is(objA[currentKey], objB[currentKey])
		) {
			return false;
		}
	}

	return true;
}

export default shallowEqual;
