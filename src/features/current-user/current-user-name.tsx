import React, { memo } from 'react';
import { BoxProps } from '@stacks/ui';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { useAccountNames } from '@common/hooks/account/use-account-names';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { truncateString } from '@common/utils';
import { Tooltip } from '@components/tooltip';
import { Title } from '@components/typography';
import { memoWithAs } from '@stacks/ui-core';

const UsernameTitle = (props: BoxProps) => (
  <Title
    data-testid="home-current-display-name"
    as="h1"
    lineHeight="1rem"
    fontSize={4}
    fontWeight={500}
    {...props}
  />
);

const UsernameSuspense = memo((props: BoxProps) => {
  const currentAccount = useCurrentAccount();
  const names = useAccountNames();
  if (!currentAccount || typeof currentAccount.index === 'undefined') return null;
  const nameCharLimit = 18;
  const name =
    names?.[currentAccount.index]?.names?.[0] || getAccountDisplayName(currentAccount as any);
  const isLong = name.length > nameCharLimit;
  const displayName = truncateString(name, nameCharLimit);

  return (
    <UsernameTitle {...props}>
      <Tooltip label={isLong ? name : undefined}>
        <div>{displayName}</div>
      </Tooltip>
    </UsernameTitle>
  );
});

export const CurrentUsername = memoWithAs((props: BoxProps) => {
  const currentAccount = useCurrentAccount();
  const defaultName = getAccountDisplayName(currentAccount as any);
  const fallback = <UsernameTitle {...props}>{defaultName}</UsernameTitle>;
  return (
    <React.Suspense fallback={fallback}>
      <UsernameSuspense {...props} />
    </React.Suspense>
  );
});
