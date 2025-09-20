import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useNetworkState} from '../index.js';

describe('useNetworkState', () => {
	it('should be defined', () => {
		expect(useNetworkState).toBeDefined();
	});
	it('should render', async () => {
		const {result} = await renderHookServer(() => useNetworkState());
	});

	it('should have undefined state', async () => {
		const hook = await renderHookServer(() => useNetworkState());

		expect(hook.result.value).toStrictEqual({
			downlink: undefined,
			downlinkMax: undefined,
			effectiveType: undefined,
			online: undefined,
			previous: undefined,
			rtt: undefined,
			saveData: undefined,
			since: undefined,
			type: undefined,
		});
	});
});
