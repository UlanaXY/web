import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {expectResultValue} from '../util/testing/test-helpers.js';
import {useList} from '../index.js';

describe('useList', () => {
	it('should be defined', () => {
		expect(useList).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => useList([1, 0, 2]));
	});
});
