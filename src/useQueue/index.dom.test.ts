import {act, renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useQueue} from '../index.js';

describe('useQueue', () => {
	it('should be defined', async () => {
		expect(useQueue).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useQueue());
		expect(result.error).toBeUndefined();
	});

	it('should accept an initial value', async () => {
		const {result} = await renderHook(() => useQueue([0, 1, 2, 3]));
		expect(result.error).toBeUndefined();
		expect(result.value!.items).toStrictEqual([0, 1, 2, 3]);
	});

	it('should remove the first value', async () => {
		const {result} = await renderHook(() => useQueue([0, 1, 2, 3]));
		expect(result.error).toBeUndefined();

		await act(async () => {
			const removed = result.value!.remove();
			expect(removed).toBe(0);
		});

		expect(result.value!.first).toBe(1);
	});

	it('should return the length', async () => {
		const {result} = await renderHook(() => useQueue([0, 1, 2, 3]));
		expect(result.error).toBeUndefined();
		expect(result.value!.size).toBe(4);
	});

	it('should add a value to the end', async () => {
		const {result} = await renderHook(() => useQueue([0, 1, 2, 3]));
		expect(result.error).toBeUndefined();

		await act(async () => {
			result.value!.add(4);
		});

		expect(result.value!.last).toBe(4);
	});

	it('should return referentially stable functions', async () => {
		const {result} = await renderHook(() => useQueue([0, 1, 2, 3]));
		expect(result.error).toBeUndefined();

		const remove1 = result.value!.remove;
		const add1 = result.value!.add;

		await act(async () => {
			result.value!.add(1);
			result.value!.remove();
		});

		expect(result.value!.remove).toBe(remove1);
		expect(result.value!.add).toBe(add1);
	});
});
