import React, { useCallback, useEffect } from 'react';

import { Route as RouterRoute, Routes as RoutesDom, useLocation } from 'react-router-dom';

import { MagicRecoveryCode } from '@pages/install/magic-recovery-code';
import { Username } from '@pages/username';
import { ChooseAccount } from '@pages/choose-account';
import { TransactionPage } from '@pages/transaction-signing/transaction-signing';
import { Installed } from '@pages/install';
import { InstalledSignIn } from '@pages/install/sign-in';

import { PopupHome } from '@pages/home/home';
import { PopupReceive } from '@pages/receive-tokens/receive-tokens';
import { AddNetwork } from '@pages/add-network/add-network';
import { PopupSendForm } from '@pages/popup/send-form';
import { SetPasswordPage } from '@pages/set-password';

import { SaveYourKeyView } from '@components/save-your-key-view';
import { ScreenPaths } from '@store/common/types';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/auth/use-onboarding-state';
import { useSaveAuthRequest } from '@common/hooks/auth/use-save-auth-request-callback';
import { Navigate } from '@components/navigate';
import { AccountGate } from '@components/account-gate';
import { AccountGateRoute } from '@components/account-gate-route';
import { lastSeenStore } from '@store/wallet';
import { Unlock } from '@components/unlock';
import { useUpdateAtom } from 'jotai/utils';

interface RouteProps {
  path: ScreenPaths;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({ path, element }) => {
  return <RouterRoute path={path} element={<>{element}</>} />;
};

export const Routes: React.FC = () => {
  const { isSignedIn: signedIn, encryptedSecretKey } = useWallet();
  const { isOnboardingInProgress } = useOnboardingState();
  const { pathname } = useLocation();
  const setLastSeen = useUpdateAtom(lastSeenStore);

  const doChangeScreen = useDoChangeScreen();
  useSaveAuthRequest();

  const isSignedIn = signedIn && !isOnboardingInProgress;
  const isLocked = !signedIn && encryptedSecretKey;

  // Keep track of 'last seen' by updating it whenever a route is set.
  useEffect(() => {
    setLastSeen(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getHomeComponent = useCallback(() => {
    if (isSignedIn || encryptedSecretKey) {
      return (
        <AccountGate>
          <PopupHome />
        </AccountGate>
      );
    }
    return <Installed />;
  }, [isSignedIn, encryptedSecretKey]);

  const getSignInComponent = () => {
    if (isLocked) return <Unlock />;
    if (isSignedIn)
      return <Navigate to={ScreenPaths.CHOOSE_ACCOUNT} screenPath={ScreenPaths.CHOOSE_ACCOUNT} />;
    return <InstalledSignIn />;
  };

  return (
    <RoutesDom>
      <Route path={ScreenPaths.HOME} element={getHomeComponent()} />
      {/* Installation */}
      <Route path={ScreenPaths.SIGN_IN_INSTALLED} element={<InstalledSignIn />} />
      <AccountGateRoute path={ScreenPaths.POPUP_HOME}>
        <PopupHome />
      </AccountGateRoute>
      <AccountGateRoute path={ScreenPaths.POPUP_SEND}>
        <React.Suspense fallback={<></>}>
          <PopupSendForm />
        </React.Suspense>
      </AccountGateRoute>
      <AccountGateRoute path={ScreenPaths.POPUP_RECEIVE}>
        <PopupReceive />
      </AccountGateRoute>
      <AccountGateRoute path={ScreenPaths.SETTINGS_KEY}>
        <SaveYourKeyView onClose={() => doChangeScreen(ScreenPaths.HOME)} title="Your Secret Key" />
      </AccountGateRoute>
      <RouterRoute path={ScreenPaths.ADD_NETWORK} element={<AddNetwork />} />
      <Route path={ScreenPaths.SET_PASSWORD} element={<SetPasswordPage redirect />} />
      <Route path={ScreenPaths.USERNAME} element={<Username />} />
      {/*Sign In*/}
      <Route path={ScreenPaths.SIGN_IN} element={getSignInComponent()} />
      <Route path={ScreenPaths.RECOVERY_CODE} element={<MagicRecoveryCode />} />
      <Route path={ScreenPaths.ADD_ACCOUNT} element={<Username />} />;
      <Route
        path={ScreenPaths.CHOOSE_ACCOUNT}
        element={
          <React.Suspense fallback={<></>}>
            <ChooseAccount />
          </React.Suspense>
        }
      />
      {/* Transactions */}
      <AccountGateRoute path={ScreenPaths.TRANSACTION_POPUP}>
        <TransactionPage />
      </AccountGateRoute>
    </RoutesDom>
  );
};
