import {renderHookServer as renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useCookieValue} from './index.js';

describe('useCookieValue', () => {
	it('should be defined', () => {
		expect(useCookieValue).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz'));
	});

	it('should return undefined', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz'));
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBeUndefined();
	});
});
