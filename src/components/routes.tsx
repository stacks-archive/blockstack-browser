import React, { useCallback, useEffect } from 'react';

import { OnboardingPassword, SaveKey } from '@pages/sign-up';
import { MagicRecoveryCode } from '@pages/install/magic-recovery-code';
import { Username } from '@pages/username';
import { SaveYourKeyView } from '@components/save-your-key-view';
import { ChooseAccount } from '@pages/connect';
import { TransactionPage } from '@pages/transaction';
import { Installed } from '@pages/install';
import { InstalledSignIn } from '@pages/install/sign-in';
import { PopupHome } from '@pages/popup';
import { PopupSend } from '@pages/popup/send';
import { PopupReceive } from '@pages/popup/receive';
import { AddNetwork } from '@pages/popup/add-network';
import { EditPostConditionsPage } from '@pages/transaction/edit-post-conditions';
import { SetPasswordPage } from '@pages/set-password';

import { ScreenPaths } from '@store/common/types';
import { useDoChangeScreen } from '@common/hooks/use-do-change-screen';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { useSaveAuthRequest } from '@common/hooks/callbacks/use-save-auth-request-callback';
import { Route as RouterRoute, Routes as RoutesDom, useLocation } from 'react-router-dom';
import { Navigate } from '@components/navigate';
import { AccountGate } from '@components/account-gate';
import { AccountGateRoute } from '@components/account-gate-route';
import { lastSeenStore } from '@store/wallet';
import { useSetRecoilState } from 'recoil';
import { ErrorBoundary } from './error-boundary';
import { Unlock } from './unlock';

interface RouteProps {
  path: ScreenPaths;
  element: React.ReactNode;
}

export const Route: React.FC<RouteProps> = ({ path, element }) => {
  return <RouterRoute path={path} element={<ErrorBoundary>{element}</ErrorBoundary>} />;
};

export const Routes: React.FC = () => {
  const { isSignedIn: signedIn, doFinishSignIn, encryptedSecretKey } = useWallet();
  const { isOnboardingInProgress } = useOnboardingState();
  const { search, pathname } = useLocation();
  const setLastSeen = useSetRecoilState(lastSeenStore);

  const doChangeScreen = useDoChangeScreen();
  useSaveAuthRequest();

  const isSignedIn = signedIn && !isOnboardingInProgress;
  const isLocked = !signedIn && encryptedSecretKey;

  // Keep track of 'last seen' by updating it whenever a route is set.
  useEffect(() => {
    setLastSeen(new Date().getTime());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const getSignUpElement = () => {
    if (isLocked) return <Unlock />;
    if (isSignedIn) {
      return (
        <Navigate
          to={`${ScreenPaths.CHOOSE_ACCOUNT}${search}`}
          screenPath={ScreenPaths.CHOOSE_ACCOUNT}
        />
      );
    }
    return <Installed />;
  };

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
          <PopupSend />
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
      {/*Sign Up*/}
      <Route path={ScreenPaths.GENERATION} element={getSignUpElement()} />
      <Route
        path={ScreenPaths.SAVE_KEY}
        element={
          <SaveKey
            next={() => {
              doChangeScreen(ScreenPaths.ONBOARDING_PASSWORD);
            }}
          />
        }
      />
      <Route
        path={ScreenPaths.ONBOARDING_PASSWORD}
        element={
          <OnboardingPassword
            next={() => {
              doChangeScreen(ScreenPaths.USERNAME);
            }}
          />
        }
      />
      <Route path={ScreenPaths.USERNAME} element={<Username />} />
      {/*Sign In*/}
      <Route path={ScreenPaths.SIGN_IN} element={getSignInComponent()} />
      <Route path={ScreenPaths.RECOVERY_CODE} element={<MagicRecoveryCode />} />
      <Route path={ScreenPaths.ADD_ACCOUNT} element={<Username />} />;
      <Route
        path={ScreenPaths.CHOOSE_ACCOUNT}
        element={
          <ChooseAccount
            next={(accountIndex: number) => {
              void doFinishSignIn(accountIndex);
            }}
          />
        }
      />
      {/* Transactions */}
      <AccountGateRoute path={ScreenPaths.TRANSACTION_POPUP}>
        <TransactionPage />
      </AccountGateRoute>
      <AccountGateRoute path={ScreenPaths.EDIT_POST_CONDITIONS}>
        <EditPostConditionsPage />
      </AccountGateRoute>
    </RoutesDom>
  );
};
