import { Box, color, Stack } from '@stacks/ui';
import { Caption } from '@components/typography';

import { stacksValue } from '@common/stacks-utils';
import React from 'react';

import { CurrentUserAvatar } from '@components/current-user/current-user-avatar';
import { CurrentUsername } from '@components/current-user/current-user-name';
import { CurrentStxAddress } from '@components/current-user/current-stx-address';
import { useAccountInfo } from '@common/hooks/account/use-account-balances';
import { LoadingRectangle } from '@components/loading-rectangle';

const Balance = () => {
  const info = useAccountInfo();
  return info?.balance ? (
    <Caption>
      {stacksValue({
        value: info.balance.toString(10),
        withTicker: true,
      })}
    </Caption>
  ) : null;
};

export function PopupHeaderFallback() {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <CurrentUserAvatar size="24px" fontSize="10px" />
          <CurrentUsername as="h3" />
          <CurrentStxAddress />
        </Stack>
        <LoadingRectangle width="72px" height="14px" />
      </Stack>
    </Box>
  );
}

export function PopupHeaderSuspense() {
  return (
    <Box p="base-loose" width="100%" borderBottom="1px solid" borderColor={color('border')}>
      <Stack isInline alignItems="center" width="100%" justifyContent="space-between">
        <Stack isInline alignItems="center">
          <CurrentUserAvatar size="24px" fontSize="10px" />
          <CurrentUsername as="h3" />
          <CurrentStxAddress />
        </Stack>
        <Balance />
      </Stack>
    </Box>
  );
}

export const PopupHeader = () => {
  return (
    <React.Suspense fallback={<PopupHeaderFallback />}>
      <PopupHeaderSuspense />
    </React.Suspense>
  );
};
