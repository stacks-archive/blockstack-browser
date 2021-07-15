import type { MempoolTransaction, Transaction } from '@stacks/stacks-blockchain-api-types';
import { todaysIsoDate, isoDateToLocalDate, displayDate } from '@common/date-utils';

type Tx = MempoolTransaction | Transaction;

function groupTxsByDateMap(txs: Tx[]) {
  return txs.reduce((txsByDate, tx) => {
    if ('burn_block_time_iso' in tx && tx.burn_block_time_iso) {
      const date = isoDateToLocalDate(tx.burn_block_time_iso);
      if (!txsByDate.has(date)) {
        txsByDate.set(date, []);
      }
      txsByDate.set(date, [...(txsByDate.get(date) || []), tx]);
    }
    if (!('burn_block_time_iso' in tx)) {
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
