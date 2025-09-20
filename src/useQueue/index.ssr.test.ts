import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useQueue} from '../index.js';

describe('useQueue', () => {
	it('should be defined', () => {
		expect(useQueue).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => useQueue());
	});

	it('should return an object', async () => {
		const {result} = await renderHookServer(() => useQueue());
		if (result.value !== undefined) {
			expect(result.value).toBeInstanceOf(Object);
		}
	});
});
