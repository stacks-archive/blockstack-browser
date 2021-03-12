import React, { memo } from 'react';
import { Button, Stack, Box, color, StackProps, DynamicColorCircle } from '@stacks/ui';
import type { ButtonProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { AccountInfo } from '@components/popup/account-info';
import { getAccountDisplayName } from '@stacks/wallet-sdk';
import { Caption, Title } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import { IconArrowUp, IconQrcode } from '@tabler/icons';
import { useAssets } from '@common/hooks/use-assets';

interface TxButtonProps extends ButtonProps {
  kind: 'send' | 'receive';
}

const TxButton: React.FC<TxButtonProps> = memo(({ kind, onClick, ...rest }) => (
  <Button
    onClick={onClick}
    size="sm"
    px="base-tight"
    py="tight"
    fontSize={2}
    mode="primary"
    {...rest}
  >
    <Box
      as={kind === 'send' ? IconArrowUp : IconQrcode}
      transform={kind === 'send' ? 'unset' : 'scaleY(-1)'}
      size="16px"
    />
    <Box as="span" ml="extra-tight" fontSize="14px">
      {kind === 'send' ? 'Send' : 'Receive'}
    </Box>
  </Button>
));

const UserAccount: React.FC<StackProps> = memo(props => {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  if (!currentAccount || !currentAccountStxAddress) {
    console.error('Error! Homepage rendered without account state, which should never happen.');
    return null;
  }
  const displayName = getAccountDisplayName(currentAccount);
  const circleText = displayName?.includes('Account') ? displayName.split(' ')[1] : displayName[0];
  return (
    <Stack spacing="base-tight" alignItems="center" isInline {...props}>
      <DynamicColorCircle
        string={`${currentAccountStxAddress}.${currentAccount.appsKey}`}
        color={color('bg')}
      >
        {circleText}
      </DynamicColorCircle>
      <Stack alignItems="flex-start" spacing="base-tight">
        <Title as="h1" lineHeight="1rem" fontSize={4} fontWeight={500}>
          {displayName}
        </Title>
        <Caption>{truncateMiddle(currentAccountStxAddress, 8)}</Caption>
      </Stack>
    </Stack>
  );
});

const Actions: React.FC<StackProps> = memo(props => {
  const { doChangeScreen } = useAnalytics();
  const assets = useAssets();
  return (
    <Stack spacing="base-tight" isInline {...props}>
      <TxButton
        isDisabled={assets.length === 0}
        onClick={() => doChangeScreen(ScreenPaths.POPUP_SEND)}
        kind="send"
      />
      <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_RECEIVE)} kind="receive" />
    </Stack>
  );
});

const PageTop: React.FC<StackProps> = memo(props => (
  <Stack data-test="home-page" spacing="loose" {...props}>
    <UserAccount />
    <Actions />
  </Stack>
));

export const PopupHome: React.FC = memo(() => (
  <PopupContainer>
    <Stack spacing="loose">
      <PageTop />
      <AccountInfo />
    </Stack>
  </PopupContainer>
));
