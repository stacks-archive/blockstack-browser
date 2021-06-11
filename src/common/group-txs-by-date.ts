import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(advancedFormat);

type Tx = MempoolTransaction | Transaction;

function todaysIsoDate() {
  return new Date().toISOString().split('T')[0];
}

function groupTxsByDateMap(txs: Tx[]) {
  return txs.reduce((txsByDate, tx) => {
    if ('burn_block_time_iso' in tx && tx.burn_block_time_iso) {
      const [date] = tx.burn_block_time_iso.split('T');
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

function displayDate(txDate: string) {
  const date = dayjs(txDate);
  if (date.isToday()) return 'Today';
  if (date.isYesterday()) return 'Yesterday';
  if (dayjs().isSame(date, 'year')) {
    return date.format('MMM Do');
  }
  return date.format('MMM Do, YYYY');
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
