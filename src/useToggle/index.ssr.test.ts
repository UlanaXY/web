import {act, renderHookServer as renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useToggle} from '../index.js';
import {expectResultValue} from '../util/testing/test-helpers.js';

describe('useToggle', () => {
	it('should be defined', () => {
		expect(useToggle).toBeDefined();
	});

	it('should default to false', async () => {
		const {result} = await renderHook(() => useToggle());
		const value = expectResultValue(result);

		expect(value[0]).toBe(false);
	});

	it('should be instantiatable with value', async () => {
		let {result} = await renderHook(() => useToggle(true));
		let value = expectResultValue(result);
		expect(value[0]).toBe(true);

		result = (await renderHook(() => useToggle(() => true))).result;
		value = expectResultValue(result);
		expect(value[0]).toBe(true);

		result = (await renderHook(() => useToggle(() => false))).result;
		value = expectResultValue(result);
		expect(value[0]).toBe(false);
	});

	it('should not change if toggler called', async () => {
		const {result} = await renderHook(() => useToggle());
		const value = expectResultValue(result);
		await act(async () => {
			value[1]();
		});
		expect(value[0]).toBe(false);

		await act(async () => {
			value[1](true);
		});
		expect(value[0]).toBe(false);
	});
});
