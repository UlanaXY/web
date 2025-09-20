import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useKeyboardEvent} from '../index.js';

describe('useKeyboardEvent', () => {
	it('should be defined', () => {
		expect(useKeyboardEvent).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => {
			useKeyboardEvent('a', () => {});
		});
	});
});
