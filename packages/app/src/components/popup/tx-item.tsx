import React from 'react';
import type {
  Transaction,
  MempoolTransaction,
  TransactionEventFungibleAsset,
} from '@blockstack/stacks-blockchain-api-types';
import { Box, Flex, Text } from '@stacks/ui';
import { stacksValue } from '@common/stacks-utils';
import BigNumber from 'bignumber.js';
import { getAssetStringParts, truncateMiddle } from '@stacks/ui-utils';

type Tx = MempoolTransaction | Transaction;

const getAssetTransfer = (tx: Tx): TransactionEventFungibleAsset | null => {
  if (tx.tx_type !== 'contract_call') return null;
  if (tx.tx_status !== 'success') return null;
  const transfer = tx.events.find(event => event.event_type === 'fungible_token_asset');
  if (transfer?.event_type !== 'fungible_token_asset') return null;
  return transfer;
};

const getTxLabel = (tx: Tx): string => {
  if (tx.tx_status === 'pending') return 'Pending Transaction';
  if (tx.tx_type === 'token_transfer') return 'Stacks Transfer';
  if (tx.tx_type === 'contract_call') {
    const transfer = getAssetTransfer(tx);
    if (transfer) return getAssetStringParts(transfer.asset.asset_id).assetName;
  }
  return tx.tx_type;
};

const getTxValue = (tx: Tx): number | string | null => {
  if (tx.tx_type === 'token_transfer') {
    return stacksValue({ value: tx.token_transfer.amount });
  }
  const transfer = getAssetTransfer(tx);
  if (transfer) return new BigNumber(transfer.asset.amount).toFormat();
  return null;
};

interface TxItemProps {
  transaction: Tx;
}
export const TxItem: React.FC<TxItemProps> = ({ transaction }) => {
  if (!transaction) {
    return null;
  }
  return (
    <Box width="100%" mt="loose">
      <Text display="block" color="ink.600" fontSize={1} mb="tight">
        Latest Transaction
      </Text>
      <Flex flexDirection="row">
        <Box flexGrow={1}>
          <Text display="block" fontWeight="400" fontSize={2} color="ink.1000">
            {getTxLabel(transaction)}
          </Text>
          <Text fontSize={0} color="ink.400">
            {truncateMiddle(transaction.tx_id)}
          </Text>
        </Box>
        <Box textAlign="right" pt="tight">
          <Text fontWeight="500">{getTxValue(transaction)}</Text>
        </Box>
      </Flex>
    </Box>
  );
};
