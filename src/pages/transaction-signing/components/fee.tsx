import React from 'react';
import { stacksValue } from '@common/stacks-utils';
import { useTransactionFee } from '@pages/transaction-signing/hooks/use-transaction-fee';

export const FeeComponent = () => {
  const { isSponsored, amount } = useTransactionFee();
  if (typeof amount === 'undefined') return null;
  return (
    <>
      {isSponsored
        ? '🎉 sponsored'
        : stacksValue({
            value: amount,
            fixedDecimals: true,
          })}
    </>
  );
};
