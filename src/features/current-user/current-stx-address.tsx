import { Box, BoxProps } from '@stacks/ui';
import { truncateMiddle } from '@stacks/ui-utils';
import React from 'react';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { memoWithAs } from '@stacks/ui-core';
import { LoadingRectangle } from '@components/loading-rectangle';

const CurrentStxAddressSuspense = memoWithAs((props: BoxProps) => {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return null;
  return <Box {...props}>{truncateMiddle(currentAccount.address, 4)}</Box>;
});

export const CurrentStxAddress = memoWithAs((props: BoxProps) => {
  return (
    <React.Suspense fallback={<LoadingRectangle height="16px" width="50px" {...props} />}>
      <CurrentStxAddressSuspense {...props} />
    </React.Suspense>
  );
});
