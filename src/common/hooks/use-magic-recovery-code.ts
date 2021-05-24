import { useRecoilState } from 'recoil';
import { magicRecoveryCodePasswordState, magicRecoveryCodeState } from '@store/onboarding';
import { useLoading } from '@common/hooks/use-loading';
import { useWallet } from '@common/hooks/use-wallet';
import React, { useCallback, useEffect, useState } from 'react';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { USERNAMES_ENABLED } from '@common/constants';
import { ScreenPaths } from '@store/common/types';
import { decrypt } from '@stacks/wallet-sdk';

export function useMagicRecoveryCode() {
  const [magicRecoveryCode, setMagicRecoveryCode] = useRecoilState(magicRecoveryCodeState);
  const [password, setPassword] = useRecoilState(magicRecoveryCodePasswordState);
  const { isLoading, setIsLoading, setIsIdle } = useLoading('useMagicRecoveryCode');
  const { doStoreSeed, doSetPassword, doFinishSignIn } = useWallet();
  const [error, setPasswordError] = useState('');
  const { decodedAuthRequest } = useOnboardingState();
  const doChangeScreen = useDoChangeScreen();

  const handleNavigate = useCallback(() => {
    if (decodedAuthRequest) {
      if (!USERNAMES_ENABLED) {
        setTimeout(() => {
          void doFinishSignIn(0);
        }, 1000);
      } else {
        doChangeScreen(ScreenPaths.USERNAME);
      }
    } else {
      doChangeScreen(ScreenPaths.HOME);
    }
  }, [doChangeScreen, decodedAuthRequest, doFinishSignIn]);

  const handleSubmit = useCallback(async () => {
    if (!magicRecoveryCode) throw Error('No magic recovery seed');
    setIsLoading();
    try {
      const codeBuffer = Buffer.from(magicRecoveryCode, 'base64');
      const seed = await decrypt(codeBuffer, password);
      await doStoreSeed(seed);
      await doSetPassword(password);
      handleNavigate();
    } catch (error) {
      setPasswordError(`Incorrect password, try again.`);
      setIsIdle();
    }
  }, [
    doSetPassword,
    setIsIdle,
    setIsLoading,
    magicRecoveryCode,
    password,
    doStoreSeed,
    handleNavigate,
  ]);

  const onChange = useCallback(
    (event: React.FormEvent<HTMLInputElement>) => {
      event.preventDefault();
      setPassword(event.currentTarget.value);
    },
    [setPassword]
  );

  const handleBack = () => doChangeScreen(ScreenPaths.SIGN_IN);

  const onSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      await handleSubmit();
    },
    [handleSubmit]
  );

  useEffect(() => {
    return () => {
      setMagicRecoveryCode('');
      setPassword('');
    };
  }, [setMagicRecoveryCode, setPassword]);

  return {
    isLoading,
    onBack: handleBack,
    onSubmit,
    onChange,
    password,
    error,
  };
}
