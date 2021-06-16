import { stacksValue } from '@common/stacks-utils';

const uSTX_AMOUNT = 10000480064; // 10,000.480064

describe('stacksValue tests', () => {
  test('no extra params', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
    });
    expect(value).toEqual('10,000.480064 STX');
  });
  test('without ticker', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
      withTicker: false,
    });
    expect(value).toEqual('10,000.480064');
  });
  test('without fixed decimals', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
      fixedDecimals: false,
    });
    expect(value).toEqual('10,000.48 STX');
  });
  test('abbreviated', () => {
    const value = stacksValue({
      value: uSTX_AMOUNT,
      abbreviate: true,
    });
    expect(value).toEqual('10K STX');
  });
});
