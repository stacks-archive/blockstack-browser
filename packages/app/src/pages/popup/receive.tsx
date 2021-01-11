import React from 'react';
import { Box, Text, Button, useClipboard } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { Toast } from '@components/toast';
import QRCode from 'qrcode.react';

export const PopupReceive: React.FC = () => {
  const { currentAccount, currentAccountStxAddress } = useWallet();
  const { doChangeScreen } = useAnalytics();
  const address = currentAccountStxAddress || '';
  const { onCopy, hasCopied } = useClipboard(address);
  return (
    <PopupContainer title="Receive" onClose={() => doChangeScreen(ScreenPaths.POPUP_HOME)}>
      <Toast show={hasCopied} />
      <Box mt="extra-loose" textAlign="center" mx="auto">
        <QRCode value={address} />
      </Box>
      <Box width="100%" mt="extra-loose" textAlign="center">
        {currentAccount?.username ? (
          <Text fontSize={2} fontWeight="600" lineHeight="40px" display="block">
            {currentAccount.username}
          </Text>
        ) : null}
        <Text fontSize={1}>{address}</Text>
      </Box>
      <Box mt="extra-loose">
        <Button width="100%" onClick={onCopy}>
          Copy your address
        </Button>
      </Box>
    </PopupContainer>
  );
};
