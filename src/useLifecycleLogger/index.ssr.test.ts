import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useLifecycleLogger} from '../index.js';

describe('useLifecycleLogger', () => {
	it('should be defined', () => {
		expect(useLifecycleLogger).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => {
			useLifecycleLogger('TestComponent');
		});
	});
});
