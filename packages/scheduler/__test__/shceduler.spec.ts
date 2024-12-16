import { ScheduleCallback } from '../src/Scheduler';
import {
	NormalPriority,
	ImmediatePriority,
	UserBlockingPriority
} from '../src/SchedulerPriorities';
import { describe, it, expect } from '@jest/globals';

describe('a test', () => {
	it('3', () => {
		let eventTask = [];
		ScheduleCallback(NormalPriority, () => {
			eventTask.push('task1');
			expect(eventTask).toEqual(['task3', 'task2', 'task1']);
			return null;
		});

		ScheduleCallback(UserBlockingPriority, () => {
			eventTask.push('task2');
			expect(eventTask).toEqual(['task3', 'task2']);
			return null;
		});

		ScheduleCallback(ImmediatePriority, () => {
			eventTask.push('task3');
			expect(eventTask).toEqual(['task3']);
			return null;
		});
	});
});
