import React, { memo } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { Button, color, Stack, BoxProps, useClipboard, StackProps } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { Text } from '@components/typography';
import { Card } from '@components/card';

export const SecretKeyMessage: React.FC<BoxProps> = props => {
  const { secretKey } = useWallet();
  const wordCount = (secretKey || '').split(' ').length;
  return (
    <Text {...props}>
      These {wordCount} words are your Secret Key. They create your account, and you sign in on
      different devices with them. Make sure to save these somewhere safe.{' '}
      <Text display="inline" fontWeight={600}>
        If you lose these words, you lose your account.
      </Text>
    </Text>
  );
};

export const SecretKeyCard: React.FC<BoxProps> = props => {
  const { secretKey } = useWallet();
  return (
    <Card title="Your Secret Key" {...props}>
      <Text
        display="block"
        data-test="textarea-seed-phrase"
        data-loaded={String(!!secretKey)}
        fontSize={2}
      >
        {secretKey}
      </Text>
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
    onClose={onClose}
    hideActions={hideActions}
    title={title || 'Save your Secret Key'}
  >
    <Stack spacing="loose" mt="loose">
      <SecretKeyMessage />
      <SecretKeyCard />
      <SecretKeyActions handleNext={handleNext || onClose} />
    </Stack>
  </PopupContainer>
));
