import React, { memo } from 'react';
import { useCurrentAccount } from '@common/hooks/account/use-current-account';
import { useAccountNames } from '@common/hooks/account/use-account-names';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { AccountAvatar } from '@features/account-avatar/account-avatar';
import { BoxProps } from '@stacks/ui';

const UserAvatarSuspense = memo((props: BoxProps) => {
  const currentAccount = useCurrentAccount();
  const names = useAccountNames();
  if (!currentAccount || typeof currentAccount.index === 'undefined') return null;
  const name = names?.[currentAccount.index]?.names?.[0] || getAccountDisplayName(currentAccount);
  return <AccountAvatar name={name} flexShrink={0} account={currentAccount} {...props} />;
});

export const CurrentUserAvatar = memo((props: BoxProps) => {
  const currentAccount = useCurrentAccount();
  if (!currentAccount) return null;
  const defaultName = getAccountDisplayName(currentAccount);
  return (
    <React.Suspense
      fallback={
        <AccountAvatar name={defaultName} flexShrink={0} account={currentAccount} {...props} />
      }
    >
      <UserAvatarSuspense {...props} />
    </React.Suspense>
  );
});
