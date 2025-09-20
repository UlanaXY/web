import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useMediatedState} from '../index.js';

describe('useMediatedState', () => {
	it('should be defined', () => {
		expect(useMediatedState).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => useMediatedState());
		expect(result.error).toBeUndefined();
	});

	it('should return initial state on first mount', async () => {
		const {result} = await renderHookServer(() => useMediatedState(123));
		expect(result.error).toBeUndefined();

		expect(result.value![0]).toBe(123);

		const {result: result2} = await renderHookServer(() =>
			useMediatedState(123, (value: string) => Number.parseInt(value, 10)),
		);
		expect(result2.error).toBeUndefined();

		expect(result2.value![0]).toBe(123);
	});
});
