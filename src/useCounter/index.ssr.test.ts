import {renderHookServer as renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useCounter} from '../index.js';
import {expectResultValue} from '../util/testing/test-helpers.js';

describe('useCounter', () => {
	it('should be defined', () => {
		expect(useCounter).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useCounter());
		const value = expectResultValue(result);
		expect(value).toBeDefined();
	});
});
