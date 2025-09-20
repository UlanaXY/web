import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {useFirstMountState} from '../index.js';

describe('useFirstMountState', () => {
	it('should return true on first render', async () => {
		const {result} = await renderHookServer(() => useFirstMountState());

		expect(result.value).toBe(true);
	});
});
