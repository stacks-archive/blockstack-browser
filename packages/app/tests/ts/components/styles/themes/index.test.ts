import { themes } from '../../../../../src/ts/components/styles/themes';

describe('Testing themes configuration', () => {
	test('Theme object containes a dark and a light property', () => {
		expect(themes).toHaveProperty('light');
		expect(themes).toHaveProperty('dark');
	});
});
