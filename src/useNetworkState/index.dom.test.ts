import {act, renderHook} from '@ver0/react-hooks-testing';
import {useRef} from 'react';
import {describe, expect, it} from 'vitest';
import {useNetworkState} from '../index.js';

describe('useNetworkState', () => {
	it('should be defined', async () => {
		expect(useNetworkState).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useNetworkState());
		expect(result.error).toBeUndefined();
	});

	it('should return an object of certain structure', async () => {
		const hook = await renderHook(() => useNetworkState(), {initialProps: false});
		expect(hook.result.error).toBeUndefined();

		expect(typeof hook.result.value!).toEqual('object');
		expect(Object.keys(hook.result.value!)).toEqual([
			'online',
			'previous',
			'since',
			'downlink',
			'downlinkMax',
			'effectiveType',
			'rtt',
			'saveData',
			'type',
		]);
	});

	it('should rerender in case of online or offline events emitted on window', async () => {
		const hook = await renderHook(
			() => {
				const renderCount = useRef(0);
				return [useNetworkState(), ++renderCount.current];
			},
			{initialProps: false},
		);
		expect(hook.result.error).toBeUndefined();

		expect(hook.result.value![1]).toBe(1);
		const previousNWState = hook.result.value![0];

		await act(async () => {
			globalThis.dispatchEvent(new Event('online'));
		});
		expect(hook.result.value![1]).toBe(2);
		expect(hook.result.value![0]).not.toBe(previousNWState);
	});
});
