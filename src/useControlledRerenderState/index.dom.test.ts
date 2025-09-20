import {act, renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useControlledRerenderState} from '../index.js';

describe('useControlledRerenderState', () => {
	it('should be defined', async () => {
		expect(useControlledRerenderState).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useControlledRerenderState());
		expect(result.error).toBeUndefined();
	});

	it('should behave as `useState` by default', async () => {
		const {result} = await renderHook(() => useControlledRerenderState(() => 0));

		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(0);

		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![1](1);
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(1);

		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![1]((i) => i + 3);
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(4);
	});

	it('should not re-render in case setter extra-argument set to false', async () => {
		const {result} = await renderHook(() => useControlledRerenderState(() => 0));

		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(0);

		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![1](1, false);
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(0);

		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![1]((i) => i + 3);
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(4);
	});
});
