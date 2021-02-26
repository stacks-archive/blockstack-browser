import React from 'react';
import { Button, Stack, Box, ButtonProps } from '@stacks/ui';
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

const TxButton: React.FC<TxButtonProps> = ({ kind, onClick, ...rest }) => {
  return (
    <Button onClick={onClick} size="sm" px="base" py="tight" fontSize={2} mode="primary" {...rest}>
      <Box
        as={kind === 'send' ? IconArrowUp : IconQrcode}
        transform={kind === 'send' ? 'unset' : 'scaleY(-1)'}
        size="14px"
      />
      <Box as="span" ml="tight" fontSize="14px">
        {kind === 'send' ? 'Send' : 'Receive'}
      </Box>
    </Button>
  );
};

export const PopupHome: React.FC = () => {
  const { currentAccount, currentAccountIndex, currentAccountStxAddress } = useWallet();
  const { doChangeScreen } = useAnalytics();
  const assets = useAssets();
  console.log(assets);
  if (!currentAccount || currentAccountIndex === undefined || !currentAccountStxAddress) {
    console.error('Error! Homepage is not present, this should never happen!');
    return null;
  }
  return (
    <PopupContainer>
      <Stack mt="loose" data-test="home-page" spacing="loose">
        <Stack alignItems="flex-start" spacing="base">
          <Title lineHeight="1rem" fontSize={4} fontWeight={500}>
            {getAccountDisplayName(currentAccount)}
          </Title>
          <Caption>{truncateMiddle(currentAccountStxAddress, 8)}</Caption>
        </Stack>
        <Stack spacing="base-tight" isInline>
          <TxButton
            isDisabled={assets.length === 0}
            onClick={() => doChangeScreen(ScreenPaths.POPUP_SEND)}
            kind="send"
          />
          <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_RECEIVE)} kind="receive" />
        </Stack>
      </Stack>
      <AccountInfo />
    </PopupContainer>
  );
};
