import React, { memo, useState } from 'react';
import { useWallet } from '@common/hooks/use-wallet';
import { SetPasswordPage } from '@pages/set-password';
import { Unlock } from '@components/unlock';
import { SaveYourKeyView } from '@components/save-your-key-view';
import { SignedOut } from '@components/signed-out-view';

enum Step {
  VIEW_KEY = 1,
  SET_PASSWORD = 2,
}

export const AccountGate: React.FC = memo(({ children }) => {
  const [step, setStep] = useState<Step>(Step.VIEW_KEY);
  const { hasRehydratedVault, hasSetPassword, isSignedIn, encryptedSecretKey } = useWallet();

  if (!hasRehydratedVault) return null;
  if (isSignedIn && hasSetPassword) return <>{children}</>;

  const needsToSetPassword = (isSignedIn || encryptedSecretKey) && !hasSetPassword;

  if (needsToSetPassword) {
    if (step === Step.VIEW_KEY) {
      return <SaveYourKeyView hideActions handleNext={() => setStep(Step.SET_PASSWORD)} />;
    } else if (step === Step.SET_PASSWORD) {
      return <SetPasswordPage />;
    }
  }
  if (!isSignedIn && encryptedSecretKey) {
    return <Unlock />;
  }
  return <SignedOut />;
});
