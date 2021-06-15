import { useWallet } from '@common/hooks/use-wallet';
import { useFetchBalances } from '@common/hooks/account/use-account-info';
import { Box, color, Stack, Text } from '@stacks/ui';
import { AccountAvatar } from '@components/account-avatar';
import { Caption, Title } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import { stacksValue } from '@common/stacks-utils';
import { LoadingRectangle } from '@components/loading-rectangle';
import React from 'react';
import { useAccountDisplayName } from '@common/hooks/account/use-account-names';

export function PopupHeader() {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const balances = useFetchBalances();
  const displayName = useAccountDisplayName();
  if (!currentAccount || !currentAccountStxAddress) return null;
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <AccountAvatar account={currentAccount} size="24px" fontSize="10px" />
          <Title as="h3">{displayName}</Title>
          <Text
            border="1px solid"
            borderColor={color('border')}
            px="tight"
            py="extra-tight"
            borderRadius="16px"
            textStyle="body.small"
            color="ink.600"
            fontSize={1}
          >
            {truncateMiddle(currentAccountStxAddress, 4)}
          </Text>
        </Stack>
        <Box>
          {balances.value ? (
            <Caption>
              {stacksValue({
                value: balances.value.stx.balance,
                withTicker: true,
                abbreviate: true,
              })}
            </Caption>
          ) : (
            <LoadingRectangle height="16px" width="50px" />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
