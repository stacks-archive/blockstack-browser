import React from 'react';
import { TransactionTypes } from '@stacks/connect';

import { addressToString, PostCondition } from '@stacks/transactions';
import { truncateMiddle } from '@stacks/ui-utils';
import { ftDecimals } from '@common/stacks-utils';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import {
  getAmountFromPostCondition,
  getIconStringFromPostCondition,
  getNameFromPostCondition,
  getPostConditionCodeMessage,
  getPostConditionTitle,
  getSymbolFromPostCondition,
  useAssetInfoFromPostCondition,
} from '@common/transactions/postcondition-utils';
import { useTransactionRequest } from '@common/hooks/use-transaction-request';
import { TransactionEventCard } from '../event-card';

interface PostConditionProps {
  pc: PostCondition;
  isLast?: boolean;
}

export const PostConditionFallbackComponent: React.FC<PostConditionProps> = ({ pc, isLast }) => {
  const currentAccount = useCurrentAccount();
  const pendingTransaction = useTransactionRequest();
  const title = getPostConditionTitle(pc);
  const iconString = getIconStringFromPostCondition(pc);
  const ticker = getSymbolFromPostCondition(pc);
  const amount = getAmountFromPostCondition(pc);
  const name = getNameFromPostCondition(pc);
  const address = addressToString(pc.principal.address);
  const isSending = address === currentAccount?.address;

  const isContractPrincipal =
    (pendingTransaction?.txType == TransactionTypes.ContractCall &&
      pendingTransaction.contractAddress === address) ||
    address.includes('.');

  if (!pendingTransaction) return null;

  const message = pc.conditionCode
    ? `${getPostConditionCodeMessage(
        pc.conditionCode,
        isSending
      )} ${amount} ${ticker} or the transaction will abort.`
    : undefined;

  return (
    <>
      <TransactionEventCard
        title={`${
          isContractPrincipal ? 'The contract ' : isSending ? 'You ' : 'Another address '
        } ${title}`}
        left={name}
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

export const PostConditionComponentSuspense: React.FC<PostConditionProps> = ({ pc, isLast }) => {
  const currentAccount = useCurrentAccount();
  const asset = useAssetInfoFromPostCondition(pc);
  const pendingTransaction = useTransactionRequest();
  const title = getPostConditionTitle(pc);
  const iconString = getIconStringFromPostCondition(pc);
  const _ticker = getSymbolFromPostCondition(pc);
  const _amount = getAmountFromPostCondition(pc);
  const name = getNameFromPostCondition(pc);
  const address = addressToString(pc.principal.address);
  const isSending = address === currentAccount?.address;

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
      )} ${amount} ${ticker} or the transaction will abort.`
    : undefined;

  return (
    <>
      <TransactionEventCard
        title={`${
          isContractPrincipal ? 'The contract ' : isSending ? 'You ' : 'Another address '
        } ${title}`}
        left={asset?.meta?.name || name}
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

export const PostConditionComponent = (props: PostConditionProps) => {
  return (
    <React.Suspense fallback={<PostConditionFallbackComponent {...props} />}>
      <PostConditionComponentSuspense {...props} />
    </React.Suspense>
  );
};
