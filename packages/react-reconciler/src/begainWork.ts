// packages/react-reconciler/src/beginWork.ts
import { ReactElementType } from 'shared/ReactTypes';
import {
	createFiberFromElement,
	createFiberFromTypeAndProps,
	createWorkInProgress,
	FiberNode,
	isSimpleFunctionComponent
} from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import {
	HostComponent,
	HostRoot,
	HostText,
	FunctionComponent,
	Fragment,
	ContextProvider,
	SimpleMemoComponent,
	MemoComponent
} from './workTags';
import { reconcileChildFibers, mountChildFibers } from './childFiber';
import { renderWithHooks } from './fiberHooks';
import { Lane } from './fiberLanes';
import { pushProvider } from './fiberNewContext';
import shallowEqual from 'shared/shallowEqual';

// 比较并返回子 FiberNode
export const beginWork = (workInProgress: FiberNode, renderLane: Lane) => {
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(workInProgress, renderLane);
		case HostComponent:
			return updateHostComponent(workInProgress);
		case FunctionComponent:
			return updateFunctionComponent(workInProgress, renderLane);
		case HostText:
			return updateHostText();
		case Fragment:
			return updateFragment(workInProgress);
		case ContextProvider:
			return updateContextProvider(workInProgress);
		case MemoComponent:
			return updateMemoComponent(workInProgress, renderLane);
		case SimpleMemoComponent:
			return updateSimpleMemoComponent(workInProgress, renderLane);
		default:
			if (__DEV__) {
				console.warn('beginWork 未实现的类型', workInProgress.tag);
			}
			break;
	}
};

function updateFragment(workInProgress: FiberNode) {
	const nextChildren = workInProgress.pendingProps;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostRoot(workInProgress: FiberNode, renderLane: Lane) {
	// 根据当前节点和工作中节点的状态进行比较，处理属性等更新逻辑
	const baseState = workInProgress.memoizedState;
	const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;

	// 计算待更新状态的最新值
	const { memoizedState } = processUpdateQueue(
		baseState,
		updateQueue,
		renderLane
	);
	workInProgress.memoizedState = memoizedState;

	// 处理子节点的更新逻辑
	const nextChildren = workInProgress.memoizedState;
	reconcileChildren(workInProgress, nextChildren);

	// 返回新的子节点
	return workInProgress.child;
}
function updateFunctionComponent(workInProgress: FiberNode, renderLane: Lane) {
	const nextChildren = renderWithHooks(workInProgress, renderLane);
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostComponent(workInProgress: FiberNode) {
	const nextProps = workInProgress.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostText() {
	// 没有子节点，直接返回 null
	return null;
}

function updateContextProvider(workInProgress: FiberNode) {
	const context = workInProgress.type._context;
	const newProps = workInProgress.pendingProps;
	const value = newProps.value;
	const nextChildren = newProps.children;
	pushProvider(context, value);
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateMemoComponent(workInProgress: FiberNode, renderLane: Lane) {
	const current = workInProgress.alternate;
	const Component = workInProgress.type;
	const type = Component.type;
	if (current === null) {
		if (
			isSimpleFunctionComponent(type) &&
			Component.compare === null &&
			Component.defaultProps === undefined
		) {
			workInProgress.type = type;
			workInProgress.tag = SimpleMemoComponent;
			return updateSimpleMemoComponent(workInProgress, renderLane);
		}
		//初次渲染
		const child = createFiberFromTypeAndProps(
			type,
			null,
			workInProgress.pendingProps
		);

		child.return = workInProgress;
		workInProgress.child = child;
		return child;
	}
	let compare = Component.compare;
	compare = compare !== null ? compare : shallowEqual;
	if (compare(current!.memoizedProps, workInProgress.pendingProps)) {
		return bailoutOnAlreadyFinishedWork();
	}

	const newChild = createWorkInProgress(
		current as FiberNode,
		workInProgress.pendingProps
	);
	newChild.return = workInProgress;
	workInProgress.child = newChild;
	return newChild;
}

function updateSimpleMemoComponent(
	workInProgress: FiberNode,
	renderLane: Lane
) {
	if (workInProgress.alternate !== null) {
		//退出渲染
		if (
			shallowEqual(
				workInProgress.alternate.memoizedProps,
				workInProgress.pendingProps
			)
		) {
			return bailoutOnAlreadyFinishedWork();
		}
	}
	return updateFunctionComponent(workInProgress, renderLane);
}

function bailoutOnAlreadyFinishedWork() {
	return null;
}

// 对比子节点的 current FiberNode 与 子节点的 ReactElement
// 生成子节点对应的 workInProgress FiberNode
function reconcileChildren(
	workInProgress: FiberNode,
	children?: ReactElementType
) {
	// alternate 指向节点的备份节点，即 current
	const current = workInProgress.alternate;
	if (current !== null) {
		// 组件的更新阶段
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current?.child,
			children
		);
	} else {
		// 首屏渲染阶段
		workInProgress.child = mountChildFibers(workInProgress, null, children);
	}
}
