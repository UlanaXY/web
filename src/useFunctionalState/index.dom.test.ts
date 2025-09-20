import {act, renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useFunctionalState} from '../index.js';

describe('useFunctionalState', () => {
	it('should be defined', async () => {
		expect(useFunctionalState).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useFunctionalState());
		expect(result.error).toBeUndefined();
	});

	it('should return proper values', async () => {
		const {result} = await renderHook(() => useFunctionalState(1));
		expect(result.error).toBeUndefined();
		expect(result.value![1]).toBeInstanceOf(Function);
		expect(result.value![0]).toBeInstanceOf(Function);
	});

	it('should return state getter', async () => {
		const {result} = await renderHook(() => useFunctionalState(1));
		expect(result.error).toBeUndefined();

		expect(result.value![0]()).toBe(1);

		await act(async () => {
			result.value![1](2);
		});

		expect(result.value![0]()).toBe(2);
	});
});
