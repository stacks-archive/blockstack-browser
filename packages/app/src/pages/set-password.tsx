import React, { useState, useCallback } from 'react';
import { Text, Button, Box, Input } from '@stacks/ui';
import { PopupContainer } from '@components/popup/container';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useWallet } from '@common/hooks/use-wallet';
import { buildEnterKeyEvent } from '@components/link';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { USERNAMES_ENABLED } from '@common/constants';
import { validatePassword, blankPasswordValidation } from '@common/validate-password';

interface SetPasswordProps {
  redirect?: boolean;
  accountGate?: boolean;
}
export const SetPasswordPage: React.FC<SetPasswordProps> = ({ redirect, accountGate }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [strengthResult, setStrengthResult] = useState(blankPasswordValidation);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { doSetPassword, wallet, doFinishSignIn } = useWallet();
  const { doChangeScreen } = useAnalytics();
  const { decodedAuthRequest } = useOnboardingState();

  const showWarning = !strengthResult.meetsAllStrengthRequirements && hasSubmitted;

  const handlePasswordInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const pass = e.currentTarget.value;
    setPassword(pass);
    const result = validatePassword(pass);
    setStrengthResult(result);
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
    <PopupContainer hideActions title="Set a password">
      <Box my="loose">
        <Text fontSize={2}>
          <Text color="green" fontWeight="500">
            This password is for this device only.
          </Text>{' '}
          To access your account on a new device you’ll use just your Secret Key.
        </Text>
      </Box>
      <Box flexGrow={[1, 1, 0.5]} />
      {showWarning ? (
        <>
          <Text display="block" textStyle="body.small" color="ink.600" mt="tight">
            Please use a stronger password before continuing.
          </Text>
          <Text display="block" textStyle="body.small" color="ink.600" my="tight">
            {strengthResult.feedback.suggestions[0]}
          </Text>
        </>
      ) : null}
      <Box width="100%">
        <Input
          placeholder="Set a password"
          key="password-input"
          width="100%"
          autoFocus
          type="password"
          data-test="set-password"
          value={password}
          onChange={handlePasswordInput}
          onKeyUp={buildEnterKeyEvent(handleSubmit)}
        />
      </Box>
      <Box mt="base">
        <Button
          width="100%"
          isLoading={loading}
          isDisabled={loading || showWarning}
          onClick={handleSubmit}
          data-test="set-password-done"
        >
          Done
        </Button>
      </Box>
    </PopupContainer>
  );
};
