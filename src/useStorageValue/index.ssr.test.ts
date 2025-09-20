import {act, renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {newStorage} from './misc.test.js';
import {useStorageValue} from './index.js';

describe('useStorageValue', () => {
	it('should be defined', () => {
		expect(useStorageValue).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => useStorageValue(newStorage(), 'foo'));
	});

	describe('if initializeWithValue set to false', () => {
		it('should not fetch value from storage on init', async () => {
			const storage = newStorage();
			const {result} = await renderHookServer(() => useStorageValue(storage, 'foo', {initializeWithValue: false}));

			expect(result.value!.value).toBe(undefined);
			expect(storage.getItem).not.toHaveBeenCalled();
		});

		it('should not fetch value from storage on .fetch() call', async () => {
			const storage = newStorage();
			const {result} = await renderHookServer(() => useStorageValue(storage, 'foo', {initializeWithValue: false}));

			expect(result.value!.value).toBe(undefined);
			await act(async () => {
				result.value!.fetch();
			});
			expect(result.value!.value).toBe(undefined);
			expect(storage.getItem).not.toHaveBeenCalled();
		});

		it('should not set storage value on .set() call', async () => {
			const storage = newStorage();
			const {result} = await renderHookServer(() =>
				useStorageValue<string>(storage, 'foo', {initializeWithValue: false}),
			);

			expect(result.value!.value).toBe(undefined);
			await act(async () => {
				result.value!.set('bar');
			});
			expect(result.value!.value).toBe(undefined);
			expect(storage.setItem).not.toHaveBeenCalled();
		});

		it('should not call storage`s removeItem on .remove() call', async () => {
			const storage = newStorage();
			const {result} = await renderHookServer(() =>
				useStorageValue<string>(storage, 'foo', {initializeWithValue: false}),
			);

			await act(async () => {
				result.value!.remove();
			});
			expect(storage.removeItem).not.toHaveBeenCalled();
		});

		it('should not set state to default value on item remove', async () => {
			const storage = newStorage(() => '"bar"');
			const {result} = await renderHookServer(() =>
				useStorageValue<string>(storage, 'foo', {
					defaultValue: 'default value',
					initializeWithValue: false,
				}),
			);

			expect(result.value!.value).toBe(undefined);
			await act(async () => {
				result.value!.remove();
			});
			expect(result.value!.value).toBe(undefined);
		});
	});
});
