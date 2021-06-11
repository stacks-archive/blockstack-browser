import React, { memo } from 'react';
import { LoadingRectangle } from '@components/loading-rectangle';
import { stacksValue } from '@common/stacks-utils';
import { useTransactionFee } from '@common/hooks/transaction/use-transaction-fee';

export const FeeComponent = memo(() => {
  const { isLoading, isSponsored, amount } = useTransactionFee();
  if (isLoading) return <LoadingRectangle width="100px" height="14px" />;
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
});
