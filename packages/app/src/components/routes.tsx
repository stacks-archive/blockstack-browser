import React, { useEffect } from 'react';

import { SaveKey, OnboardingPassword } from '@pages/sign-up';
import { DecryptRecoveryCode } from '@pages/sign-in';
import { Username } from '@pages/username';
import { SecretKey } from '@pages/secret-key';
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

import { ScreenPaths } from '@store/onboarding/types';
import { authenticationInit } from '@common/utils';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { Routes as RoutesDom, Route as RouterRoute, useLocation } from 'react-router-dom';
import { Navigate } from '@components/navigate';
import { AccountGate, AccountGateRoute } from '@components/account-gate';
import { lastSeenStore } from '@store/recoil/wallet';
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
  const { doChangeScreen } = useAnalytics();
  const {
    isSignedIn: signedIn,
    doFinishSignIn,
    doSaveAuthRequest,
    encryptedSecretKey,
  } = useWallet();
  const { isOnboardingInProgress } = useOnboardingState();
  const authRequest = authenticationInit();
  const { search, pathname } = useLocation();
  const setLastSeen = useSetRecoilState(lastSeenStore);
  const isSignedIn = signedIn && !isOnboardingInProgress;
  const isLocked = !signedIn && encryptedSecretKey;

  useEffect(() => {
    if (authRequest) {
      doSaveAuthRequest(authRequest);
    }
  }, [doSaveAuthRequest, authRequest]);

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

  const getHomeComponent = () => {
    if (isSignedIn || encryptedSecretKey) {
      return <AccountGate element={<PopupHome />} />;
    }
    return <Installed />;
  };

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
      <AccountGateRoute path={ScreenPaths.POPUP_HOME} element={<PopupHome />} />
      <AccountGateRoute path={ScreenPaths.POPUP_SEND} element={<PopupSend />} />
      <AccountGateRoute path={ScreenPaths.POPUP_RECEIVE} element={<PopupReceive />} />
      <AccountGateRoute path={ScreenPaths.SETTINGS_KEY} element={<SecretKey />} />
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
      <Route path={ScreenPaths.RECOVERY_CODE} element={<DecryptRecoveryCode />} />
      <Route path={ScreenPaths.ADD_ACCOUNT} element={<Username />} />;
      <Route
        path={ScreenPaths.CHOOSE_ACCOUNT}
        element={
          <ChooseAccount
            next={(accountIndex: number) => {
              doFinishSignIn(accountIndex);
            }}
          />
        }
      />
      {/* Transactions */}
      <AccountGateRoute path={ScreenPaths.TRANSACTION_POPUP} element={<TransactionPage />} />
      <AccountGateRoute
        path={ScreenPaths.EDIT_POST_CONDITIONS}
        element={<EditPostConditionsPage />}
      />
    </RoutesDom>
  );
};
