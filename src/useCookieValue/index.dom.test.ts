import {act, renderHook} from '@ver0/react-hooks-testing';
import Cookies from 'js-cookie';
import {afterAll, beforeAll, beforeEach, describe, expect, it, vi} from 'vitest';
import {useCookieValue} from './index.js';
import type {UseCookieValueReturn} from './index.js';

describe('useCookieValue', () => {
	let getSpy = vi.spyOn(Cookies, 'get');
	let setSpy = vi.spyOn(Cookies, 'set');
	let removeSpy = vi.spyOn(Cookies, 'remove');

	beforeAll(() => {
		getSpy = vi.spyOn(Cookies, 'get');
		setSpy = vi.spyOn(Cookies, 'set');
		removeSpy = vi.spyOn(Cookies, 'remove');
	});

	afterAll(() => {
		getSpy.mockRestore();
		setSpy.mockRestore();
		removeSpy.mockRestore();
	});

	beforeEach(() => {
		getSpy.mockClear();
		setSpy.mockClear();
		removeSpy.mockClear();
	});

	it('should be defined', async () => {
		expect(useCookieValue).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz'));
		expect(result.error).toBeUndefined();
	});

	it('should return cookie value on first render', async () => {
		Cookies.set('react-hookz', 'awesome');

		const {result} = await renderHook(() => useCookieValue('react-hookz'));
		expect((result.all[0] as any).value[0]).toBe('awesome');

		Cookies.remove('react-hookz');
	});

	it('should return undefined on first render if `initializeWithValue` set to false', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz', {initializeWithValue: false}));
		expect((result.all[0] as any).value[0]).toBeUndefined();
	});

	it('should return null if cookie not exists', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz'));
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(null);
		expect(getSpy).toHaveBeenCalledWith('react-hookz');
	});

	it('should set the cookie value on call to `set`', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz'));

		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(null);
		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![1]('awesome');
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe('awesome');
		expect(setSpy).toHaveBeenCalledWith('react-hookz', 'awesome', {});
		Cookies.remove('react-hookz');
	});

	it('should remove cookie value on call to `remove`', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz'));

		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(null);
		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![1]('awesome');
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe('awesome');

		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![2]();
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(null);
		expect(removeSpy).toHaveBeenCalledWith('react-hookz', {});
		Cookies.remove('react-hookz');
	});

	it('should re-fetch cookie value on call to `fetch`', async () => {
		const {result} = await renderHook(() => useCookieValue('react-hookz'));

		Cookies.set('react-hookz', 'rulez');
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe(null);
		await act(async () => {
			expect(result.error).toBeUndefined();
			result.value![3]();
		});
		expect(result.error).toBeUndefined();
		expect(result.value![0]).toBe('rulez');

		Cookies.remove('react-hookz');
	});

	it('should be synchronized between several hooks with the same key', async () => {
		const {result: result1} = await renderHook(() => useCookieValue('react-hookz'));
		const {result: result2} = await renderHook(() => useCookieValue('react-hookz'));

		expect(result1.error).toBeUndefined();
		expect(result1.value![0]).toBe(null);
		expect(result2.error).toBeUndefined();
		expect(result2.value![0]).toBe(null);

		await act(async () => {
			expect(result1.error).toBeUndefined();
			result1.value![1]('awesome');
		});

		expect(result1.error).toBeUndefined();
		expect(result1.value![0]).toBe('awesome');
		expect(result2.error).toBeUndefined();
		expect(result2.value![0]).toBe('awesome');

		await act(async () => {
			expect(result2.error).toBeUndefined();
			result2.value![2]();
		});

		expect(result1.error).toBeUndefined();
		expect(result1.value![0]).toBe(null);
		expect(result2.error).toBeUndefined();
		expect(result2.value![0]).toBe(null);
	});

	it('should return stable methods', async () => {
		const {result, rerender} = await renderHook(() => useCookieValue('react-hookz'));

		expect(result.error).toBeUndefined();
		const result1 = result.value!;

		await rerender();

		expect(result.error).toBeUndefined();
		expect(result1[1]).toBe(result.value![1]);
		expect(result1[2]).toBe(result.value![2]);
		expect(result1[3]).toBe(result.value![3]);
	});
});
