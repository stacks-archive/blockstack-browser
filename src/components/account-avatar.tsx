import { BoxProps, color, DynamicColorCircle } from '@stacks/ui';
import React from 'react';
import { Account, getAccountDisplayName } from '@stacks/wallet-sdk';

export const AccountAvatar: React.FC<{ account: Account } & BoxProps> = ({ account, ...props }) => {
  const displayName = getAccountDisplayName(account);
  const circleText = displayName?.includes('Account') ? displayName.split(' ')[1] : displayName[0];
  return (
    <DynamicColorCircle
      string={`${account.salt}.${account.dataPrivateKey}::${account.dataPrivateKey}`} // is this an issue?
      color={color('bg')}
      {...props}
    >
      {circleText}
    </DynamicColorCircle>
  );
};
