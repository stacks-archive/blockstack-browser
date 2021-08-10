import { countDecimals } from './utils';

describe(countDecimals.name, () => {
  test('that it returns 0 when given an integer', () => expect(countDecimals(100)).toEqual(0));

  test('that it returns accurate decimal numbers', () => {
    expect(countDecimals(0.999)).toEqual(3);
    expect(countDecimals('0.000000000000000000000000000001')).toEqual(30);
    expect(countDecimals(0.1)).toEqual(1);
  });
});
