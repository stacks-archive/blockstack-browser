import React, { memo } from 'react';
import { useSignedTransaction } from '@common/hooks/transaction/use-transaction';
import { LoadingRectangle } from '@components/loading-rectangle';
import { AuthType } from '@stacks/transactions';
import { stacksValue } from '@common/stacks-utils';

export const FeeComponent = memo(() => {
  const signedTransaction = useSignedTransaction();
  if (signedTransaction.isLoading) return <LoadingRectangle width="100px" height="14px" />;
  if (!signedTransaction.value) return null;
  const sponsored = signedTransaction.value.auth.authType === AuthType.Sponsored;
  const value = signedTransaction.value.auth.spendingCondition?.fee?.toNumber() || 0;
  return (
    <>
      {sponsored
        ? '🎉 sponsored'
        : stacksValue({
            value,
            fixedDecimals: true,
          })}
    </>
  );
});
