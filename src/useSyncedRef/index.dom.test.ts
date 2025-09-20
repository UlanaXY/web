import {renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useSyncedRef} from '../index.js';

describe('useSyncedRef', () => {
	it('should be defined', async () => {
		expect(useSyncedRef).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useSyncedRef(1));
		expect(result.error).toBeUndefined();
	});

	it('should return ref object', async () => {
		const {result} = await renderHook(() => useSyncedRef(1));
		expect(result.error).toBeUndefined();

		expect(result.value!).toEqual({current: 1});
	});

	it('should return same ref between renders', async () => {
		const {result, rerender} = await renderHook(() => useSyncedRef(1));
		expect(result.error).toBeUndefined();

		const ref = result.value!;
		await rerender();
		expect(result.value!).toEqual(ref);
		await rerender();
		expect(result.value!).toEqual(ref);
		await rerender();
		expect(result.value!).toEqual(ref);
	});

	it('should contain actual value on each render', async () => {
		const {result, rerender} = await renderHook(({val}) => useSyncedRef<any>(val), {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			initialProps: {val: 1 as any},
		});
		expect(result.error).toBeUndefined();

		expect(result.value!.current).toBe(1);
		const value1 = {foo: 'bar'};
		await rerender({val: value1});
		expect(result.value!.current).toBe(value1);
		const value2 = ['a', 'b', 'c'];
		await rerender({val: value2});
		expect(result.value!.current).toBe(value2);
	});

	it('should throw on attempt to change ref', async () => {
		const {result} = await renderHook(() => useSyncedRef(1));
		expect(result.error).toBeUndefined();

		expect(() => {
			// @ts-expect-error testing irrelevant usage
			result.value!.foo = 'bar';
		}).toThrow(new TypeError('Cannot add property foo, object is not extensible'));

		expect(() => {
			// @ts-expect-error testing irrelevant usage
			result.value!.current = 2;
		}).toThrow(new TypeError('Cannot set property current of #<Object> which has only a getter'));
	});
});
