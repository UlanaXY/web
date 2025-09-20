import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {usePrevious} from '../index.js';

describe('usePrevious', () => {
	it('should be defined', () => {
		expect(usePrevious).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => usePrevious());
	});

	it('should return undefined on first render', async () => {
		const {result} = await renderHookServer(() => usePrevious());

		expect(result.value).toBeUndefined();
	});
});
