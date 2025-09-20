import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useResizeObserver} from '../index.js';

describe('useResizeObserver', () => {
	it('should be defined', () => {
		expect(useResizeObserver).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => {
			useResizeObserver(null, () => {});
		});
	});
});
