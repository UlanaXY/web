import {act, renderHook} from '@ver0/react-hooks-testing';
import {describe, expect, it, vi} from 'vitest';
import {newStorage} from './misc.test.js';
import {useStorageValue} from './index.js';

describe('useStorageValue', () => {
	it('should be defined', async () => {
		expect(useStorageValue).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHook(() => useStorageValue(newStorage(), 'foo'));

		expect(result.error).toBeUndefined();
	});

	it('should action methods should be stable between renders', async () => {
		const {result, rerender} = await renderHook(() => useStorageValue(newStorage(), 'foo'));
		expect(result.error).toBeUndefined();

		await rerender();
		await act(async () => {
			result.value!.set('bar');
		});
		await rerender();

		const firstResult = result.all[0] as any;

		expect(firstResult.value.set).toBe(result.value!.set);
		expect(firstResult.value.fetch).toBe(result.value!.fetch);
		expect(firstResult.value.remove).toBe(result.value!.remove);
	});

	it('should fetch value from storage only on init', async () => {
		const storage = newStorage((key) => `"${key}"`);
		const {result, rerender} = await renderHook(() => useStorageValue(storage, 'foo'));
		expect(result.error).toBeUndefined();

		expect(result.value!.value).toBe('foo');
		expect(storage.getItem).toHaveBeenCalledWith('foo');

		await rerender();
		await rerender();
		await rerender();

		expect(storage.getItem).toHaveBeenCalledTimes(1);
	});

	it('should pass value through JSON.parse during fetch', async () => {
		const JSONParseSpy = vi.spyOn(JSON, 'parse');
		const storage = newStorage((key) => `"${key}"`);
		const {result} = await renderHook(() => useStorageValue(storage, 'foo'));
		expect(result.error).toBeUndefined();

		expect(result.value!.value).toBe('foo');
		expect(JSONParseSpy).toHaveBeenCalledWith('"foo"');

		JSONParseSpy.mockRestore();
	});

	it('should yield default value in case storage returned null during fetch', async () => {
		const {result} = await renderHook(() => useStorageValue(newStorage(), 'foo', {defaultValue: 'defaultValue'}));
		expect(result.error).toBeUndefined();

		expect(result.value!.value).toBe('defaultValue');
	});

	it('should yield default value and console.warn in case storage returned corrupted JSON', async () => {
		const warnSpy = vi.spyOn(console, 'warn').mockImplementationOnce(() => {});
		const {result} = await renderHook(() =>
			useStorageValue(
				newStorage(() => 'corrupted JSON'),
				'foo',
				{defaultValue: 'defaultValue'},
			),
		);
		expect(result.error).toBeUndefined();

		expect(result.value!.value).toBe('defaultValue');
		expect(warnSpy.mock.calls[0][0]).toBeInstanceOf(SyntaxError);

		warnSpy.mockRestore();
	});

	it('should not fetch value on first render in case `initializeWithValue` options is set to false', async () => {
		const {result} = await renderHook(() =>
			useStorageValue<string>(
				newStorage(() => '"bar"'),
				'foo',
				{initializeWithValue: false},
			),
		);

		expect((result.all[0] as any).value.value).toBe(undefined);
		expect((result.all[1] as any).value.value).toBe('bar');
	});

	it('should fetch value on first render in case `initializeWithValue` options is set to true', async () => {
		const {result} = await renderHook(() =>
			useStorageValue<string>(
				newStorage(() => '"bar"'),
				'foo',
				{initializeWithValue: true},
			),
		);
		expect((result.all[0] as any).value.value).toBe('bar');
	});

	it('should set storage value on .set() call', async () => {
		const {result} = await renderHook(() => useStorageValue<string>(newStorage(), 'foo'));
		expect(result.error).toBeUndefined();

		expect(result.value!.value).toBe(null);
		await act(async () => {
			result.value!.set('bar');
		});
		expect(result.value!.value).toBe('bar');

		const spySetter = vi.fn(() => 'baz');
		await act(async () => {
			result.value!.set(spySetter);
		});
		expect(result.value!.value).toBe('baz');
		expect(spySetter).toHaveBeenCalledWith('bar');
	});

	it('should call JSON.stringify on setState call', async () => {
		const JSONStringifySpy = vi.spyOn(JSON, 'stringify');
		const {result} = await renderHook(() => useStorageValue<string>(newStorage(), 'foo'));
		expect(result.error).toBeUndefined();

		expect(result.value!.value).toBe(null);
		await act(async () => {
			result.value!.set('bar');
		});
		expect(result.value!.value).toBe('bar');
		expect(JSONStringifySpy).toHaveBeenCalledWith('bar');
		JSONStringifySpy.mockRestore();
	});

	it('should not store null or data that cannot be processed by JSON serializer', async () => {
		const {result} = await renderHook(() =>
			useStorageValue<string>(
				newStorage(() => '"bar"'),
				'foo',
				{defaultValue: 'default value'},
			),
		);

		const invalidData: {a?: unknown} = {};
		invalidData.a = {b: invalidData};

		expect(result.value!.value).toBe('bar');
		await act(async () => {
			// @ts-expect-error testing inappropriate use
			result.value!.set(null);
		});
		expect(result.value!.value).toBe('bar');
	});

	it('should call storage`s removeItem on .remove() call', async () => {
		const storage = newStorage();
		const {result} = await renderHook(() => useStorageValue<string>(storage, 'foo'));

		await act(async () => {
			result.value!.remove();
		});
		expect(storage.removeItem).toHaveBeenCalledWith('foo');
	});

	it('should set state to default value on item remove', async () => {
		const {result} = await renderHook(() =>
			useStorageValue<string>(
				newStorage(() => '"bar"'),
				'foo',
				{defaultValue: 'default value'},
			),
		);

		expect(result.value!.value).toBe('bar');
		await act(async () => {
			result.value!.remove();
		});
		expect(result.value!.value).toBe('default value');
	});

	it('should refetch value from store on .fetch() call', async () => {
		const storage = newStorage(() => '"bar"');
		const {result} = await renderHook(() => useStorageValue<string>(storage, 'foo', {defaultValue: 'default value'}));

		expect(storage.getItem).toHaveBeenCalledTimes(1);
		expect(result.value!.value).toBe('bar');
		storage.getItem.mockImplementationOnce(() => '"baz"');

		await act(async () => {
			result.value!.fetch();
		});

		expect(storage.getItem).toHaveBeenCalledTimes(2);
		expect(result.value!.value).toBe('baz');
	});

	it('should refetch value on key change', async () => {
		const storage = newStorage((k) => `"${k}"`);
		const {result, rerender} = await renderHook(
			({key}) => useStorageValue<string>(storage, key, {defaultValue: 'default value'}),
			{initialProps: {key: 'foo'}},
		);

		expect(result.value!.value).toBe('foo');
		await rerender({key: 'bar'});
		expect(result.value!.value).toBe('bar');
	});

	it('should use custom stringify option', async () => {
		const storage = newStorage();
		const {result} = await renderHook(() =>
			useStorageValue<number[]>(storage, 'foo', {
				stringify(data) {
					return data.map((number_) => number_.toString(16)).join(':');
				},
				parse(str, fallback) {
					if (str === null) {
						return fallback;
					}

					if (str === '') {
						return [];
					}

					return str.split(':').map((number_) => Number.parseInt(number_, 16));
				},
			}),
		);

		expect(result.value!.value).toBe(null);
		await act(async () => {
			result.value!.set([1, 2, 3]);
		});
		expect(storage.setItem).toHaveBeenCalledWith('foo', '1:2:3');
	});

	it('should use custom parse option', async () => {
		const storage = newStorage();
		storage.getItem.mockImplementationOnce(() => '1:2:3');
		const {result} = await renderHook(() =>
			useStorageValue<number[]>(storage, 'foo', {
				stringify(data) {
					return data.map((number_) => number_.toString(16)).join(':');
				},
				parse(str, fallback) {
					if (str === null) {
						return fallback;
					}

					if (str === '') {
						return [];
					}

					return str.split(':').map((number_) => Number.parseInt(number_, 16));
				},
			}),
		);
		expect(result.value!.value).toEqual([1, 2, 3]);
	});

	describe('should handle window`s `storage` event', () => {
		it('should update state if tracked key is updated', async () => {
			const {result} = await renderHook(() => useStorageValue<string>(localStorage, 'foo'));
			expect(result.value!.value).toBe(null);

			localStorage.setItem('foo', 'bar');
			await act(async () => {
				globalThis.dispatchEvent(
					new StorageEvent('storage', {key: 'foo', storageArea: localStorage, newValue: '"foo"'}),
				);
			});

			expect(result.value!.value).toBe('foo');
			localStorage.removeItem('foo');
		});

		it('should not update data on event storage or key mismatch', async () => {
			const {result} = await renderHook(() => useStorageValue<string>(localStorage, 'foo'));
			expect(result.value!.value).toBe(null);

			await act(async () => {
				globalThis.dispatchEvent(
					new StorageEvent('storage', {
						key: 'foo',
						storageArea: sessionStorage,
						newValue: '"foo"',
					}),
				);
			});
			expect(result.value!.value).toBe(null);

			await act(async () => {
				globalThis.dispatchEvent(
					new StorageEvent('storage', {
						key: 'bar',
						storageArea: localStorage,
						newValue: 'foo',
					}),
				);
			});
			expect(result.value!.value).toBe(null);

			localStorage.removeItem('foo');
		});
	});

	describe('synchronisation', () => {
		it('should update state of all hooks with the same key in same storage', async () => {
			const hook1 = await renderHook(() => useStorageValue<string>(localStorage, 'foo'));
			const hook2 = await renderHook(() => useStorageValue<string>(localStorage, 'foo'));

			expect(hook1.result.value!.value).toBe(null);
			expect(hook2.result.value!.value).toBe(null);

			await act(async () => {
				hook1.result.value!.set('bar');
			});
			expect(hook1.result.value!.value).toBe('bar');
			expect(hook2.result.value!.value).toBe('bar');

			await act(async () => {
				hook1.result.value!.remove();
			});
			expect(hook1.result.value!.value).toBe(null);
			expect(hook2.result.value!.value).toBe(null);

			localStorage.setItem('foo', '"123"');
			await act(async () => {
				hook1.result.value!.fetch();
			});
			expect(hook1.result.value!.value).toBe('123');
			expect(hook2.result.value!.value).toBe('123');
			localStorage.removeItem('foo');
		});
	});
});
