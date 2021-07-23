import { useAtomValue } from 'jotai/utils';
import { accountDataState } from '@store/accounts';
import { stacksValue } from '@common/stacks-utils';
import { Caption, Text } from '@components/typography';
import { color } from '@stacks/ui';
import React from 'react';

export const AccountBalanceCaption = ({ address }: { address: string }) => {
  const accountData = useAtomValue(accountDataState(address));
  if (!accountData) return null;
  const balance = stacksValue({
    value: parseInt(accountData?.balances.stx.balance),
    withTicker: true,
    abbreviate: true,
  });
  return (
    <>
      <Text color={color('text-caption')} fontSize="10px">
        •
      </Text>
      <Caption>{balance}</Caption>
    </>
  );
};
