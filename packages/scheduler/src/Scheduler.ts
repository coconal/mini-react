import { getCurrentTime } from 'shared/utils';
import { peek, pop, push } from './SchedulerMinHeap';
import {
	PriorityLevel,
	NoPriority,
	ImmediatePriority,
	UserBlockingPriority,
	NormalPriority,
	LowPriority,
	IdlePriority
} from './SchedulerPriorities';
import {
	lowPriorityTimeout,
	normalPriorityTimeout,
	userBlockingPriorityTimeout
} from './SchedulerFeatureFlags';

// Max 31 bit integer. The max integer size in V8 for 32-bit systems.
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
const maxSigned31BitInt = 1073741823;

export type Task = {
	id: number;
	callback: Callback | null;
	priorityLevel: PriorityLevel;
	startTime: number;
	expirationTime: number;
	sortIndex: number;
};

type Callback = (arg: boolean) => Callback | null | undefined;

//任务池 最小堆
const taskQueue: Array<Task> = [];

let taskIdCount = 1;

let currentTask: Task | null = null;
let currentPriorityLevel: PriorityLevel = NoPriority;

//起始时间 时间戳
let startTime = -1;

//时间切片 时间段
let frameInterval = 5;

// 锁
//是否有 work 在执行
let isPerformingWork = false;

let isHostCallbackScheduled = false;

let isMessageLoopRunning = false;

function shouldYieldToHost() {
	const timeElapsed = getCurrentTime() - startTime;

	if (timeElapsed < frameInterval) {
		return false;
	}

	return true;
}

//任务调度入口
export function ScheduleCallback(
	priorityLevel: PriorityLevel,
	callback: Callback
) {
	let startTime = getCurrentTime();

	let timeout: number;
	switch (priorityLevel) {
		case ImmediatePriority:
			timeout = -1;
			break;
		case UserBlockingPriority:
			timeout = userBlockingPriorityTimeout;
			break;
		case IdlePriority:
			timeout = maxSigned31BitInt;
			break;
		case LowPriority:
			timeout = lowPriorityTimeout;
			break;
		case NormalPriority:
		default:
			timeout = normalPriorityTimeout;
			break;
	}

	const expirationTime = startTime + timeout;
	const newTask: Task = {
		id: taskIdCount++,
		callback,
		priorityLevel,
		startTime,
		expirationTime,
		sortIndex: -1
	};

	newTask.sortIndex = expirationTime;
	push(taskQueue, newTask);

	if (!isHostCallbackScheduled && !isPerformingWork) {
		isHostCallbackScheduled = true;
		requestHostCallback();
	}
}

function requestHostCallback() {
	if (!isMessageLoopRunning) {
		isMessageLoopRunning = true;
		schedulePerformWorkUntilDeadline();
	}
}

function performWorkUntilDeadline() {
	if (isMessageLoopRunning) {
		const currentTime = getCurrentTime();
		startTime = currentTime;
		let hasMoreWork = true;
		try {
			hasMoreWork = flushWork(currentTime);
		} finally {
			if (hasMoreWork) {
				schedulePerformWorkUntilDeadline();
			} else {
				isMessageLoopRunning = false;
			}
		}
	}
}

const channel = new MessageChannel();
const port = channel.port2;
channel.port1.onmessage = performWorkUntilDeadline;
function schedulePerformWorkUntilDeadline() {
	port.postMessage(null);
}

function flushWork(initialTime: number) {
	isHostCallbackScheduled = false;
	isPerformingWork = true;

	let previousPriorityLevel = currentPriorityLevel;
	try {
		return workLoop(initialTime);
	} finally {
		currentTask = null;
		currentPriorityLevel = previousPriorityLevel;
		isPerformingWork = false;
	}
}

function cancelCallback() {
	currentTask!.callback = null;
}

function getCurrentPriorityLevel(): PriorityLevel {
	return currentPriorityLevel;
}

function workLoop(initialTime: number): boolean {
	let currentTime = initialTime;
	currentTask = peek(taskQueue);
	while (currentTask !== null) {
		if (currentTask.expirationTime > currentTime && shouldYieldToHost()) {
			break;
		}

		//执行任务
		const callback = currentTask.callback;
		if (typeof callback === 'function') {
			currentTask.callback = null;
			currentPriorityLevel = currentTask.priorityLevel;
			const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
			const continuationCallback = callback(didUserCallbackTimeout);
			if (typeof continuationCallback === 'function') {
				currentTask.callback = continuationCallback;
				return true;
			} else {
				if (currentTask === peek(taskQueue)) {
					pop(taskQueue);
				}
			}
		} else {
			pop(taskQueue);
		}
		currentTask = peek(taskQueue);
	}
	if (currentTask !== null) {
		return true;
	} else {
		return false;
	}
}
