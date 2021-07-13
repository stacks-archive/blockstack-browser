import { with0x } from '@common/utils';

export function validateTxId(txid: string): boolean {
  const value = with0x(txid).toLowerCase();
  if (value.length !== 66) return false;
  return with0x(BigInt(value).toString(16).padStart(64, '0')) === value;
}
