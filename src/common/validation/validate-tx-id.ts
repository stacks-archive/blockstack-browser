export function validateTxId(tx_id: string): boolean {
  const value = !tx_id.startsWith('0x') ? `0x${tx_id}` : tx_id;
  const regex = /0x[A-Fa-f0-9]{64}/;
  const matches = regex.exec(value);
  return matches?.[0] === value;
}
