import React, { memo } from 'react';
import { Stack } from '@stacks/ui';
import { AccountAvatar } from '@components/account-avatar';
import { Caption, Title } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { useAccountNames } from '@common/hooks/use-account-names';
import { AccountWithAddress } from '@store/accounts';

export const AccountItem = memo(({ account, ...rest }: { account: AccountWithAddress }) => {
  const names = useAccountNames();
  const name = names.value?.[account.index]?.names?.[0] || getAccountDisplayName(account);
  return (
    <Stack isInline alignItems="center" spacing="base" {...rest}>
      <AccountAvatar name={name} account={account} />
      <Stack spacing="base-tight">
        <Title fontSize={2} lineHeight="1rem" fontWeight="400">
          {name}
        </Title>
        <Caption>{truncateMiddle(account.address, 9)}</Caption>
      </Stack>
    </Stack>
  );
});
