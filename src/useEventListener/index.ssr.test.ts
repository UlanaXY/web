import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useEventListener} from '../index.js';

describe('useEventListener', () => {
	it('should be defined', () => {
		expect(useEventListener).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => {
			useEventListener(null, 'random name', () => {});
		});
	});
});
