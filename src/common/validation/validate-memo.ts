import { MEMO_MAX_LENGTH_BYTES } from '@stacks/transactions';

const exceedsMaxLengthBytes = (string: string, maxLengthBytes: number): boolean =>
  string ? Buffer.from(string).length > maxLengthBytes : false;

export function isTxMemoValid(memo: string) {
  return !exceedsMaxLengthBytes(memo, MEMO_MAX_LENGTH_BYTES);
}
