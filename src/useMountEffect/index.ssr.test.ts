import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it, vi} from 'vitest';
import {useMountEffect} from '../index.js';

describe('useMountEffect', () => {
	it('should call effector only on first render', () => {
		const spy = vi.fn();

		renderHookServer(() => {
			useMountEffect(spy);
		});

		expect(spy).toHaveBeenCalledTimes(0);
	});
});
