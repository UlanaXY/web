import {renderHookServer as renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useDocumentVisibility} from '../index.js';

describe('useDocumentVisibility', () => {
	it('should be defined', () => {
		expect(useDocumentVisibility).toBeDefined();
	});

	it('should return undefined regardless of `initializeWithValue` parameter', async () => {
		expect((await renderHook(() => useDocumentVisibility())).result.value).toBeUndefined();
		expect((await renderHook(() => useDocumentVisibility(true))).result.value).toBeUndefined();
		expect((await renderHook(() => useDocumentVisibility(false))).result.value).toBeUndefined();
	});
});
