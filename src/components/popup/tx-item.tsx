import React, { useCallback } from 'react';
import type {
  Transaction,
  MempoolTransaction,
  TransactionEventFungibleAsset,
} from '@blockstack/stacks-blockchain-api-types';
import { Box, BoxProps, color, Stack, transition } from '@stacks/ui';
import { getTxTypeName, isPendingTx, truncateMiddle } from '@stacks/ui-utils';
import { useHover } from 'use-events';
import BigNumber from 'bignumber.js';

import { stacksValue } from '@common/stacks-utils';
import { useCurrentNetwork } from '@common/hooks/use-current-network';

import { Caption, Title } from '@components/typography';
import { SpaceBetween } from '@components/space-between';
import { TxItemIcon } from '@components/tx-icon';
import { Tooltip } from '@components/tooltip';

type Tx = MempoolTransaction | Transaction;

const getAssetTransfer = (tx: Tx): TransactionEventFungibleAsset | null => {
  if (tx.tx_type !== 'contract_call') return null;
  if (tx.tx_status !== 'success') return null;
  const transfer = tx.events.find(event => event.event_type === 'fungible_token_asset');
  if (transfer?.event_type !== 'fungible_token_asset') return null;
  return transfer;
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

const getTxCaption = (transaction: Tx) => {
  if (!transaction) return null;
  switch (transaction.tx_type) {
    case 'smart_contract':
      return truncateMiddle(transaction.smart_contract.contract_id, 4);
    case 'contract_call':
      return truncateMiddle(transaction.contract_call.contract_id, 4);
    case 'token_transfer':
    case 'coinbase':
    case 'poison_microblock':
      return truncateMiddle(transaction.tx_id);
    default:
      return null;
  }
};

function makeTxExplorerLink(txid: string, chain: 'mainnet' | 'testnet') {
  return `https://explorer.stacks.co/txid/${txid}?chain=${chain}`;
}

const Status: React.FC<{ transaction: Tx } & BoxProps> = ({ transaction, ...rest }) => {
  const isPending = isPendingTx(transaction as any);
  const isFailed = !isPending && transaction.tx_status !== 'success';
  return isFailed || isPending ? (
    <Box {...rest}>
      {isPending && (
        <Caption variant="c2" color={color('feedback-alert')}>
          Pending
        </Caption>
      )}
      {isFailed && (
        <Tooltip
          placement="bottom"
          label={
            // TODO: better language around failure
            transaction.tx_status
          }
        >
          <Caption variant="c2" color={color('feedback-error')}>
            Failed
          </Caption>
        </Tooltip>
      )}
    </Box>
  ) : null;
};

export const TxItem: React.FC<TxItemProps & BoxProps> = ({ transaction, ...rest }) => {
  const { mode } = useCurrentNetwork();
  const [isHovered, bind] = useHover();

  const handleOpenLink = useCallback(
    () => window.open(makeTxExplorerLink(transaction.tx_id, mode), '_blank'),
    [transaction, mode]
  );

  if (!transaction) {
    return null;
  }

  return (
    <Box onClick={handleOpenLink} position="relative" cursor="pointer" {...bind} {...rest}>
      <Stack
        py="tight"
        alignItems="center"
        spacing="base-loose"
        isInline
        position="relative"
        zIndex={2}
      >
        <TxItemIcon transaction={transaction} />
        <Stack flexGrow={1} spacing="base-tight">
          <SpaceBetween>
            <Title as="h3">{getTxTypeName(transaction as any)}</Title>
            <Title as="h3">{getTxValue(transaction)}</Title>
          </SpaceBetween>
          <Stack isInline>
            <Status transaction={transaction} />
            <Caption variant="c2">{getTxCaption(transaction)}</Caption>
          </Stack>
        </Stack>
      </Stack>
      <Box
        opacity={isHovered ? 1 : 0}
        transition={transition}
        borderRadius="8px"
        position="absolute"
        size="calc(100% + 24px)"
        left="-12px"
        top="-12px"
        bg={color('bg-4')}
        zIndex={1}
      />
    </Box>
  );
};
