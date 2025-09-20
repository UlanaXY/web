import {renderHookServer} from '@ver0/react-hooks-testing';
import {describe, expect, it} from 'vitest';
import {usePermission} from '../index.js';

describe('usePermission', () => {
	it('should be defined', () => {
		expect(usePermission).toBeDefined();
	});

	it('should render', async () => {
		const {result} = await renderHookServer(() => usePermission({name: 'geolocation'}));
	});
});
