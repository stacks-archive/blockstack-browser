import { useRecoilState } from 'recoil';
import { magicRecoveryCodePasswordState, magicRecoveryCodeState } from '@store/recoil/seed';
import { useLoading } from '@common/hooks/use-loading';
import { useWallet } from '@common/hooks/use-wallet';
import React, { useCallback, useEffect, useState } from 'react';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { useAnalytics } from '@common/hooks/use-analytics';
import { USERNAMES_ENABLED } from '@common/constants';
import { ScreenPaths } from '@store/onboarding/types';
import { decrypt } from '@stacks/wallet-sdk';
import { SIGN_IN_CORRECT } from '@common/track';

export function useMagicRecoveryCode() {
  const [magicRecoveryCode, setMagicRecoveryCode] = useRecoilState(magicRecoveryCodeState);
  const [password, setPassword] = useRecoilState(magicRecoveryCodePasswordState);
  const { isLoading, setIsLoading, setIsIdle } = useLoading();
  const { doStoreSeed, doSetPassword, doFinishSignIn } = useWallet();
  const [error, setPasswordError] = useState('');
  const { decodedAuthRequest } = useOnboardingState();
  const { doChangeScreen, doTrack } = useAnalytics();

  const handleNavigate = () => {
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
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading();
    try {
      const codeBuffer = Buffer.from(magicRecoveryCode, 'base64');
      const seed = await decrypt(codeBuffer, password);
      await doStoreSeed(seed);
      await doSetPassword(password);
      doTrack(SIGN_IN_CORRECT);
      handleNavigate();
    } catch (error) {
      setPasswordError(`Incorrect password, try again.`);
      setIsIdle();
    }
  }, [magicRecoveryCode, password, doStoreSeed, handleNavigate, doTrack]);

  const onChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    event.preventDefault();
    setPassword(event.currentTarget.value);
  }, []);

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
  }, []);

  return {
    isLoading,
    onBack: handleBack,
    onSubmit,
    onChange,
    password,
    error,
  };
}
