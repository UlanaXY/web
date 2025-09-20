import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {expectResultValue} from '../util/testing/test-helpers.js';
import {useRafState} from '../index.js';

describe('useRafState', () => {
	it('should be defined', () => {
		expect(useRafState).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => useRafState());
	});
});
