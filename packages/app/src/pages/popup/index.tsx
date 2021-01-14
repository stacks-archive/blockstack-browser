import React from 'react';
import { Box, Text, Button, ArrowIcon, BoxProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { AccountInfo } from '@components/popup/account-info';
import { getAccountDisplayName } from '@stacks/wallet-sdk';

interface TxButtonProps extends BoxProps {
  variant: 'send' | 'receive';
}

const TxButton: React.FC<TxButtonProps> = ({ variant, onClick }) => {
  return (
    <Button
      onClick={onClick}
      mode="primary"
      mr="base-tight"
      color="blue"
      customStyles={{
        primary: {
          backgroundColor: '#F2F2FF',
        },
        secondary: {},
        tertiary: {},
      }}
    >
      <ArrowIcon
        direction={variant === 'send' ? ('up' as any) : ('down' as any)}
        mr="base-tight"
        height="12px"
      />
      {variant === 'send' ? 'Send' : 'Receive'}
    </Button>
  );
};

export const PopupHome: React.FC = () => {
  const { currentAccount, currentAccountIndex, currentAccountStxAddress } = useWallet();
  const { doChangeScreen } = useAnalytics();

  if (!currentAccount || currentAccountIndex === undefined || !currentAccountStxAddress) {
    return null;
  }
  return (
    <PopupContainer>
      <Box width="100%" mt="loose" data-test="home-page">
        <Text
          fontSize="24px"
          fontWeight="600"
          lineHeight="40px"
          fontFamily="heading"
          color="ink.1000"
          display="block"
        >
          {getAccountDisplayName(currentAccount)}
        </Text>
        <Text textStyle="body.small" color="ink.600" fontSize={['11px', 1]}>
          {currentAccountStxAddress}
        </Text>
      </Box>
      <Box width="100%" mt="loose">
        <Box>
          <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_SEND)} variant="send" />
          <TxButton onClick={() => doChangeScreen(ScreenPaths.POPUP_RECEIVE)} variant="receive" />
        </Box>
      </Box>
      <AccountInfo />
    </PopupContainer>
  );
};
