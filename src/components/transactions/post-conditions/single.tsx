import { TransactionTypes } from '@stacks/connect';
import React from 'react';
import { addressToString, PostCondition } from '@stacks/transactions';

import { truncateMiddle } from '@stacks/ui-utils';
import { getPostConditionTitle } from '@common/stacks-utils';

import { usePendingTransaction } from '@common/hooks/use-pending-transaction';
import { TransactionEventCard } from '@components/transactions/event-card';
import { useCurrentAccount } from '@common/hooks/use-current-account';
import {
  getAmountFromPostCondition,
  getIconStringFromPostCondition,
  getPostConditionCodeMessage,
  getSymbolFromPostCondition,
} from '@common/postcondition-utils';

interface PostConditionProps {
  pc: PostCondition;
  isLast?: boolean;
}

export const PostConditionComponent: React.FC<PostConditionProps> = ({ pc, isLast }) => {
  const { stxAddress } = useCurrentAccount();
  const pendingTransaction = usePendingTransaction();
  const title = getPostConditionTitle(pc);
  const iconString = getIconStringFromPostCondition(pc);
  const ticker = getSymbolFromPostCondition(pc);
  const amount = getAmountFromPostCondition(pc);
  const address = addressToString(pc.principal.address);
  const isSending = address === stxAddress;

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
        right={`${isSending ? 'From' : 'To'} ${truncateMiddle(
          addressToString(pc.principal.address),
          4
        )}`}
        amount={amount}
        ticker={ticker}
        icon={iconString}
        message={message}
        isLast={isLast}
      />
    </>
  );
};
