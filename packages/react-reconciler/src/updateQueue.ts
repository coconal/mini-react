// packages/react-reconciler/src/updateQueue.ts
import { Action } from 'shared/ReactTypes';
import { Update } from './fiberFlags';
import { Dispatch } from 'react/src/currentDispatcher';
import { Lane } from './fiberLanes';

// 定义 Update 数据结构
export interface Update<State> {
	action: Action<State>;
	next: Update<State> | null;
	lane: Lane;
}

// 定义 UpdateQueue 数据结构
export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
	dispatch: Dispatch<State> | null;
	lastReducer: ((s: State, a: any) => State) | null;
	lastState: State | null;
}

// 创建 Update 实例的方法
export const createUpdate = <State>(
	action: Action<State>,
	lane: Lane
): Update<State> => {
	return {
		action,
		next: null,
		lane
	};
};

// 创建 UpdateQueue 实例的方法
export const createUpdateQueue = <State>(): UpdateQueue<State> => {
	return {
		shared: {
			pending: null
		},
		dispatch: null,
		lastReducer: null,
		lastState: null
	};
};

// 将 Update 添加到 UpdateQueue 中的方法
export const enqueueUpdate = <State>(
	updateQueue: UpdateQueue<State>,
	update: Update<State>
) => {
	const pending = updateQueue.shared.pending;
	if (pending === null) {
		update.next = update;
	} else {
		update.next = pending.next;
		pending.next = update;
	}
	// pending 指向 update 环状链表的最后一个节点
	updateQueue.shared.pending = update;
};

// 从 UpdateQueue 中消费 Update 的方法
export const processUpdateQueue = <State>(
	baseState: State,
	queue: UpdateQueue<State> | null,
	renderLane: Lane
): { memoizedState: State } => {
	const result: ReturnType<typeof processUpdateQueue<State>> = {
		memoizedState: baseState
	};
	if (queue !== null) {
		const pendingUpdate = queue.shared.pending;
		queue!.shared.pending = null;
		const reducer = queue.lastReducer;
		const lastState = queue.lastState;

		if (pendingUpdate !== null) {
			// 第一个 update
			const first = pendingUpdate.next;
			let pending = first as Update<any>;
			do {
				const updateLane = pending.lane;
				if (updateLane == renderLane) {
					const action = pending.action;

					if (action instanceof Function) {
						// action 是回调函数

						baseState = action(baseState);
					} else {
						// action 是状态值
						if (reducer !== null && lastState !== null) {
							baseState = reducer(baseState, action);
						} else {
							baseState = action;
						}
					}
				} else {
					if (__DEV__) {
						console.error('不应该进入 updateLane !== renderLane 逻辑');
					}
				}
				pending = pending.next as Update<any>;
			} while (pending !== first);
		}
	}

	result.memoizedState = baseState;
	return result;
};
