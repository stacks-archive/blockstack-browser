import React, { useState, useCallback, useRef } from 'react';
import { Button, Input, Stack } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { ScreenPaths } from '@store/types';
import { useWallet } from '@common/hooks/use-wallet';
import { buildEnterKeyEvent } from '@components/link';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { USERNAMES_ENABLED } from '@common/constants';
import { validatePassword, blankPasswordValidation } from '@common/validate-password';
import { Body, Caption } from '@components/typography';
import debounce from 'just-debounce-it';
import { Header } from '@components/header';

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
  const doChangeScreen = useDoChangeScreen();
  const { decodedAuthRequest } = useOnboardingState();

  const showWarning = !strengthResult.meetsAllStrengthRequirements && hasSubmitted;

  const validate = debounce((value: string) => {
    const result = validatePassword(value);
    setStrengthResult(result);
    ref?.current?.focus();
  }, 100);

  const handlePasswordInput = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setPassword(value);
      validate(value);
    },
    [validate]
  );

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
    <PopupContainer header={<Header hideActions title="Set a password." />}>
      <Stack spacing="loose">
        <Body className="onboarding-text">
          This password is for this device only. To access your account on a new device you will use
          your Secret Key.
        </Body>
        <Stack spacing="loose" width="100%">
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
      </Stack>
    </PopupContainer>
  );
};
