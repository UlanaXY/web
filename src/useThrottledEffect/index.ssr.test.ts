import {renderHookServer as renderHook} from '@ver0/react-hooks-testing';
import {afterAll, afterEach, beforeAll, describe, expect, it, vi} from 'vitest';
import {useThrottledEffect} from '../index.js';
import {expectResultValue} from '../util/testing/test-helpers.js';

describe('useThrottledEffect', () => {
	beforeAll(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it('should be defined', async () => {
		expect(useThrottledEffect).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => {
			useThrottledEffect(() => {}, [], 200);
		});
	});
});
