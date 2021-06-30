import React, { memo } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { Button, color, Stack, BoxProps, useClipboard, StackProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { Body, Text } from '@components/typography';
import { Card } from '@components/card';
import { Header } from '@components/header';

export const SecretKeyMessage: React.FC<BoxProps> = props => {
  const { secretKey } = useWallet();
  const wordCount = (secretKey || '').split(' ').length;
  return (
    <Body {...props} className="onboarding-text">
      These {wordCount} words are your Secret Key. They create your account, and you sign in on
      different devices with them. Make sure to save these somewhere safe.{' '}
      <Text display="inline" fontWeight={500}>
        If you lose these words, you lose your account.
      </Text>
    </Body>
  );
};

export const SecretKeyCard: React.FC<BoxProps> = props => {
  const { secretKey } = useWallet();
  return (
    <Card title="Your Secret Key" {...props}>
      <Body data-test="textarea-seed-phrase" data-loaded={String(!!secretKey)}>
        {secretKey}
      </Body>
    </Card>
  );
};

export const SecretKeyActions: React.FC<{ handleNext?: () => void } & StackProps> = ({
  handleNext,
  ...rest
}) => {
  const { secretKey } = useWallet();
  const { onCopy, hasCopied } = useClipboard(secretKey || '');
  return (
    <Stack spacing="base" {...rest}>
      <Button
        data-test="copy-key-to-clipboard"
        width="100%"
        border="1px solid"
        borderColor={color('border')}
        color={color(hasCopied ? 'text-caption' : 'brand')}
        mode="tertiary"
        onClick={hasCopied ? undefined : onCopy}
      >
        {hasCopied ? 'Copied!' : 'Copy to clipboard'}
      </Button>
      {handleNext && (
        <Button width="100%" onClick={handleNext} data-test="confirm-saved-key">
          I've saved it
        </Button>
      )}
    </Stack>
  );
};

export const SaveYourKeyView: React.FC<{
  handleNext?: () => void;
  onClose?: () => void;
  title?: string;
  hideActions?: boolean;
}> = memo(({ title, handleNext, hideActions, onClose }) => (
  <PopupContainer
    header={
      <Header onClose={onClose} hideActions={hideActions} title={title || 'Save your Secret Key'} />
    }
  >
    <Stack spacing="loose">
      <SecretKeyMessage />
      <SecretKeyCard />
      <SecretKeyActions handleNext={handleNext || onClose} />
    </Stack>
  </PopupContainer>
));
