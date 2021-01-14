import React, { createRef, useState, useCallback } from 'react';
import { Box, Text, Button, Input } from '@stacks/ui';
import { useDispatch } from '@common/hooks/use-dispatch';
import { doSetMagicRecoveryCode } from '@store/onboarding/actions';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { SIGN_IN_CORRECT, SIGN_IN_INCORRECT } from '@common/track';
import { ErrorLabel } from '@components/error-label';
import { PopupContainer } from '@components/popup/container';

export const InstalledSignIn: React.FC = () => {
  const textAreaRef = createRef<HTMLTextAreaElement>();
  const [isLoading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');
  const [seedError, setSeedError] = useState<null | string>(null);
  const dispatch = useDispatch();
  const { doStoreSeed } = useWallet();
  const { doChangeScreen, doTrack } = useAnalytics();

  const hasLineReturn = (input: string) => input.includes('\n');

  const onSubmit = useCallback(async () => {
    setLoading(true);
    const parsedKeyInput = seed.trim();
    try {
      if (parsedKeyInput.length === 0) {
        setSeedError('Entering your Secret Key is required.');
        setLoading(false);
        return;
      }
      if (parsedKeyInput.split(' ').length <= 1) {
        dispatch(doSetMagicRecoveryCode(parsedKeyInput));
        doChangeScreen(ScreenPaths.RECOVERY_CODE);
        return;
      }
      await doStoreSeed(parsedKeyInput);

      doTrack(SIGN_IN_CORRECT);
      doChangeScreen(ScreenPaths.SET_PASSWORD);
    } catch (error) {
      setSeedError("The Secret Key you've entered is invalid");
      doTrack(SIGN_IN_INCORRECT);
    }
    setLoading(false);
  }, [seed, dispatch, doStoreSeed, doChangeScreen, doTrack]);

  return (
    <PopupContainer hideActions>
      <Box mt="extra-loose">
        <Text fontSize={['32px', '24px']} lineHeight="48px" fontWeight="500">
          Continue with Secret Key
        </Text>
      </Box>
      <Box mt="base">
        <Text fontSize="base" color="ink.600">
          Enter your Secret Key to sign in to Stacks Wallet.
        </Text>
      </Box>
      <Box flexGrow={[1, 1, 0.5]} />
      <Box width="100%">
        <Input
          autoFocus
          mt="base-loose"
          minHeight="68px"
          placeholder="Enter your Secret Key"
          as="textarea"
          value={seed}
          fontSize={'16px'}
          autoCapitalize="off"
          spellCheck={false}
          width="100%"
          style={{ resize: 'none' }}
          ref={textAreaRef as any}
          onChange={async (evt: React.FormEvent<HTMLInputElement>) => {
            setSeedError(null);
            setSeed(evt.currentTarget.value);
            if (hasLineReturn(evt.currentTarget.value)) {
              textAreaRef.current?.blur();
              await onSubmit();
            }
          }}
        />
        {seedError && (
          <ErrorLabel lineHeight="16px">
            <Text
              textAlign="left"
              textStyle="caption"
              color="feedback.error"
              data-test="sign-in-seed-error"
            >
              {seedError}
            </Text>
          </ErrorLabel>
        )}
      </Box>
      <Box width="100%" my="base-loose">
        <Button
          width="100%"
          isLoading={isLoading}
          isDisabled={isLoading}
          data-test="sign-in-key-continue"
          onClick={async (event: MouseEvent) => {
            event.preventDefault();
            return onSubmit();
          }}
        >
          Sign in
        </Button>
      </Box>
    </PopupContainer>
  );
};
