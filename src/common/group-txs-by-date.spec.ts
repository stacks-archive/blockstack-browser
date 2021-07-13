import type { Transaction } from '@stacks/stacks-blockchain-api-types';
import { createTxDateFormatList } from './group-txs-by-date';

function createFakeTx(tx: Partial<Transaction>) {
  return { tx_status: 'success', ...tx } as Transaction;
}

describe(createTxDateFormatList.name, () => {
  test('grouping by date', () => {
    const mockTx = createFakeTx({
      burn_block_time_iso: '1991-02-08T13:48:04.699Z',
    });
    expect(createTxDateFormatList([mockTx])).toEqual([
      {
        date: '1991-02-08',
        displayDate: 'Feb 8th, 1991',
        txs: [mockTx],
      },
    ]);
  });

  test('relative dates todays date', () => {
    const today = new Date().toISOString();
    const mockTx = createFakeTx({ burn_block_time_iso: today });
    const result = createTxDateFormatList([mockTx]);
    expect(result[0].date).toEqual(today.split('T')[0]);
    expect(result[0].displayDate).toEqual('Today');
  });

  test('relative dates yesterdays date', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const mockTx = createFakeTx({ burn_block_time_iso: yesterday.toISOString() });
    const result = createTxDateFormatList([mockTx]);
    expect(result[0].date).toEqual(yesterday.toISOString().split('T')[0]);
    expect(result[0].displayDate).toEqual('Yesterday');
  });

  test('dates from this year omit year', () => {
    const date = new Date();
    date.setFullYear(date.getFullYear());
    date.setMonth(6);
    const mockTx = createFakeTx({ burn_block_time_iso: date.toISOString() });
    const result = createTxDateFormatList([mockTx]);
    expect(result[0].date).toEqual(date.toISOString().split('T')[0]);
    expect(result[0].displayDate).not.toContain(new Date().getFullYear());
  });
});
