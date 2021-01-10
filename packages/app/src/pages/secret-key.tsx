import React from 'react';
import { PopupContainer } from '@components/popup/container';
import { Text, Button, Box, useClipboard } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { Card } from '@components/card';
import { SeedTextarea } from '@components/seed-textarea';
import { Toast } from '@components/toast';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';

export const SecretKey: React.FC = () => {
  const { secretKey } = useWallet();
  const { onCopy, hasCopied } = useClipboard(secretKey || '');
  const { doChangeScreen } = useAnalytics();

  const words = (secretKey || '').split(' ').length;

  return (
    <PopupContainer title="Your secret key">
      <Toast show={hasCopied} />
      <Text my="base" display="block">
        Here’s your Secret Key: {words} words that prove it’s you when you want to use {name} on a
        new device. Once lost it’s lost forever, so save it somewhere you won’t forget.
      </Text>
      <Card title="Your Secret Key" my="loose">
        <SeedTextarea
          readOnly
          spellCheck="false"
          autoCapitalize="false"
          value={secretKey}
          className="hidden-secret-key"
          data-test="textarea-seed-phrase"
          data-loaded={String(!!secretKey)}
        />
      </Card>
      <Box my="base">
        <Button mb="base" width="100%" mode="secondary" onClick={onCopy}>
          Copy to clipboard
        </Button>
        <Button
          width="100%"
          onClick={() => doChangeScreen(ScreenPaths.HOME)}
          data-test="confirm-saved-key"
        >
          I've saved it
        </Button>
      </Box>
    </PopupContainer>
  );
};
