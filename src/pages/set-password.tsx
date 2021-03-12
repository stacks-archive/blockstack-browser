import React, { useState, useCallback, useRef } from 'react';
import { Button, Input, Stack } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { buildEnterKeyEvent } from '@components/link';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { USERNAMES_ENABLED } from '@common/constants';
import { validatePassword, blankPasswordValidation } from '@common/validate-password';
import { Caption, Text } from '@components/typography';
import debounce from 'just-debounce-it';

interface SetPasswordProps {
  redirect?: boolean;
  accountGate?: boolean;
  placeholder?: string;
}

export const SetPasswordPage: React.FC<SetPasswordProps> = ({
  redirect,
  accountGate,
  placeholder,
}) => {
  const ref = useRef<HTMLInputElement | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { doSetPassword, wallet, doFinishSignIn } = useWallet();
  const { doChangeScreen } = useAnalytics();
  const { decodedAuthRequest } = useOnboardingState();

  const showWarning = !strengthResult.meetsAllStrengthRequirements && hasSubmitted;

  const validate = debounce((value: string) => {
    const result = validatePassword(value);
    setStrengthResult(result);
    ref?.current?.focus();
  }, 100);

  const handlePasswordInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setPassword(value);
    validate(value);
  }, []);

  const submit = useCallback(async () => {
    if (!wallet) throw 'Please log in before setting a password.';
    setLoading(true);
    await doSetPassword(password);
    if (accountGate) return;
    if (decodedAuthRequest) {
      const { accounts } = wallet;
      if (accounts && (accounts.length > 1 || accounts[0].username)) {
        doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT);
      } else if (!USERNAMES_ENABLED) {
        await doFinishSignIn(0);
      } else {
        doChangeScreen(ScreenPaths.USERNAME);
      }
    } else if (redirect) {
      doChangeScreen(ScreenPaths.INSTALLED);
    }
  }, [
    doSetPassword,
    doChangeScreen,
    password,
    redirect,
    decodedAuthRequest,
    wallet,
    doFinishSignIn,
    accountGate,
  ]);

  const handleSubmit = useCallback(async () => {
    if (!password) return;
    setLoading(true);
    setHasSubmitted(true);
    const result = validatePassword(password);
    setStrengthResult(result);
    if (result.meetsAllStrengthRequirements) {
      await submit();
      return;
    }
    setLoading(false);
  }, [password, submit]);

  return (
    <PopupContainer hideActions title="Set a password.">
      <Text>
        <Text color="green" fontWeight="500">
          This password is for this device only.
        </Text>{' '}
        To access your account on a new device you’ll use just your Secret Key.
      </Text>
      <Stack spacing="base" mt="auto" width="100%">
        {showWarning ? (
          <Caption fontSize={0}>
            Please use a stronger password before continuing. Longer than 12 characters, with
            symbols, numbers, and words.
          </Caption>
        ) : null}
        <Input
          ref={ref}
          placeholder={placeholder || 'Set a password'}
          key="password-input"
          width="100%"
          autoFocus
          type="password"
          data-test="set-password"
          onChange={handlePasswordInput}
          onKeyUp={buildEnterKeyEvent(handleSubmit)}
        />

        <Button
          width="100%"
          isLoading={loading}
          isDisabled={loading || showWarning}
          onClick={handleSubmit}
          data-test="set-password-done"
        >
          Done
        </Button>
      </Stack>
    </PopupContainer>
  );
};
