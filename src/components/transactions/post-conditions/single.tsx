import { TransactionTypes } from '@stacks/connect';
import React from 'react';
import { addressToString, PostCondition } from '@stacks/transactions';

import { truncateMiddle } from '@stacks/ui-utils';
import { ftDecimals, getPostConditionTitle } from '@common/stacks-utils';

import { usePendingTransaction } from '@common/hooks/use-pending-transaction';
import { TransactionEventCard } from '@components/transactions/event-card';
import { useCurrentAccount } from '@common/hooks/use-current-account';
import {
  getAmountFromPostCondition,
  getIconStringFromPostCondition,
  getPostConditionCodeMessage,
  getSymbolFromPostCondition,
  useAssetInfoFromPostCondition,
} from '@common/postcondition-utils';

interface PostConditionProps {
  pc: PostCondition;
  isLast?: boolean;
}

export const PostConditionComponent: React.FC<PostConditionProps> = ({ pc, isLast }) => {
  const { stxAddress } = useCurrentAccount();
  const asset = useAssetInfoFromPostCondition(pc);
  const pendingTransaction = usePendingTransaction();
  const title = getPostConditionTitle(pc);
  const iconString = getIconStringFromPostCondition(pc);
  const _ticker = getSymbolFromPostCondition(pc);
  const _amount = getAmountFromPostCondition(pc);
  const address = addressToString(pc.principal.address);
  const isSending = address === stxAddress;

  const amount =
    typeof asset?.meta?.decimals === 'number' ? ftDecimals(_amount, asset.meta.decimals) : _amount;

  const ticker = asset?.meta?.symbol || _ticker;

  const isContractPrincipal =
    (pendingTransaction?.txType == TransactionTypes.ContractCall &&
      pendingTransaction.contractAddress === address) ||
    address.includes('.');

  if (!pendingTransaction) return null;

  const message = pc.conditionCode
    ? `${getPostConditionCodeMessage(
        pc.conditionCode,
        isSending
        // TODO: fetch asset info in SIP 10 branch
      )} ${amount} ${ticker} or the transaction will abort.`
    : undefined;

  return (
    <>
      <TransactionEventCard
        title={`${
          isContractPrincipal ? 'The contract ' : isSending ? 'You ' : 'Another address '
        } ${title}`}
        left={asset?.meta?.name}
        right={`${isSending ? 'From' : 'To'} ${truncateMiddle(
          addressToString(pc.principal.address),
          4
        )}`}
        amount={amount}
        ticker={asset?.meta?.symbol || ticker}
        icon={iconString}
        message={message}
        isLast={isLast}
      />
    </>
  );
};
