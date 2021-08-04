import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { todaysIsoDate, isoDateToLocalDate, displayDate } from '@common/date-utils';

type Tx = MempoolTransaction | Transaction;

function isoDateToLocalDateSafe(isoDate: string) {
  let result;
  try {
    result = isoDateToLocalDate(isoDate);
  } catch (e) {
    console.log(isoDate);
    console.log(e);
  }
  return result;
}

function txHasTime(tx: Tx) {
  return !!(
    ('burn_block_time_iso' in tx && tx.burn_block_time_iso) ||
    ('parent_burn_block_time_iso' in tx && tx.parent_burn_block_time_iso)
  );
}

function groupTxsByDateMap(txs: Tx[]) {
  return txs.reduce((txsByDate, tx) => {
    let time =
      ('burn_block_time_iso' in tx && tx.burn_block_time_iso) ||
      ('parent_burn_block_time_iso' in tx && tx.parent_burn_block_time_iso);
    const date = time ? isoDateToLocalDateSafe(time) : undefined;
    if (date && txHasTime(tx)) {
      if (!txsByDate.has(date)) {
        txsByDate.set(date, []);
      }
      txsByDate.set(date, [...(txsByDate.get(date) || []), tx]);
    }
    if (!txHasTime(tx)) {
      const today = todaysIsoDate();
      txsByDate.set(today, [...(txsByDate.get(today) || []), tx]);
    }
    return txsByDate;
  }, new Map<string, Tx[]>());
}

function formatTxDateMapAsList(txMap: Map<string, Tx[]>) {
  return [...txMap.keys()].map(date => ({
    date,
    displayDate: displayDate(date),
    txs: txMap.get(date) ?? [],
  }));
}

function filterDuplicateTx(txs: Tx[]) {
  return txs.filter(tx => {
    const countOfCurrentTxid = txs.filter(({ tx_id }) => tx.tx_id === tx_id).length;
    const isDropped = tx.tx_status.includes('dropped');
    if (countOfCurrentTxid === 1 && !isDropped) return true;
    return tx.tx_status === 'success' || tx.tx_status.includes('abort');
  });
}

export function createTxDateFormatList(txs: Tx[]) {
  return formatTxDateMapAsList(groupTxsByDateMap(filterDuplicateTx(txs)));
}
