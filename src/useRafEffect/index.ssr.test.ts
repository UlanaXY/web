import {renderHookServer as renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {expectResultValue} from '../util/testing/test-helpers.js';
import {useRafEffect} from '../index.js';

describe('useRafEffect', () => {
	it('should be defined', () => {
		expect(useRafEffect).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => {
			useRafEffect(() => {}, []);
		});
	});
});
