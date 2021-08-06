import { BoxProps, color, Circle } from '@stacks/ui';
import React from 'react';
import { Account, getAccountDisplayName } from '@stacks/wallet-sdk';

import { useAccountGradient } from '@common/hooks/account/use-account-gradient';
import { AccountWithAddress } from '@store/accounts';
import { useAccountDisplayName } from '@common/hooks/account/use-account-names';

export const AccountAvatar: React.FC<
  { account: AccountWithAddress | Account; name?: string } & BoxProps
> = ({ account, name, ...props }) => {
  const displayName = name && name.includes('.') ? name : getAccountDisplayName(account);
  const gradient = useAccountGradient(account);

  const circleText = displayName?.includes('Account') ? displayName.split(' ')[1] : displayName[0];
  return (
    <Circle flexShrink={0} backgroundImage={gradient} color={color('bg')} {...props}>
      {circleText.toUpperCase()}
    </Circle>
  );
};

export const AccountAvatarWithNameInner: React.FC<
  { account: AccountWithAddress | Account } & BoxProps
> = ({ account, ...props }) => {
  const name = useAccountDisplayName(account);
  return <AccountAvatar account={account} name={name} {...props} />;
};

export const AccountAvatarWithName: React.FC<{ account: AccountWithAddress | Account } & BoxProps> =
  ({ account, ...props }) => {
    return (
      <React.Suspense fallback={<AccountAvatar account={account} {...props} />}>
        <AccountAvatarWithNameInner account={account} {...props} />
      </React.Suspense>
    );
  };
