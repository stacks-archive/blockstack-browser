import React, { useEffect } from 'react';
import { Home } from '@pages/home';
import { Create, SaveKey } from '@pages/sign-up';
import { SignIn, DecryptRecoveryCode } from '@pages/sign-in';

import { Username } from '@pages/username';
import { SecretKey } from '@pages/secret-key';

import { ChooseAccount } from '@pages/connect';

import { Transaction } from '@pages/transaction';

import { doSaveAuthRequest } from '@store/onboarding/actions';
import { useDispatch } from '@common/hooks/use-dispatch';
import { ScreenPaths } from '@store/onboarding/types';
import { doFinishSignIn as finishSignIn } from '@store/onboarding/actions';
import { authenticationInit } from '@common/utils';
import { useAnalytics } from '@common/hooks/use-analytics';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnboardingState } from '@common/hooks/use-onboarding-state';
import { Routes as RoutesDom, Route, useLocation } from 'react-router-dom';
import { Navigate } from '@components/navigate';

export const Routes: React.FC = () => {
  const dispatch = useDispatch();
  const { doChangeScreen } = useAnalytics();
  const { identities } = useWallet();
  const { isOnboardingInProgress, onboardingPath } = useOnboardingState();
  const authRequest = authenticationInit();
  const { search } = useLocation();

  useEffect(() => {
    if (authRequest) {
      dispatch(doSaveAuthRequest(authRequest));
    }
  }, [authRequest]);

  const doFinishSignIn = ({ identityIndex }: { identityIndex: number } = { identityIndex: 0 }) =>
    dispatch(finishSignIn({ identityIndex }));

  const isSignedIn = !isOnboardingInProgress && identities.length;

  const getSignUpElement = () => {
    if (onboardingPath) {
      return <Navigate to={onboardingPath} screenPath={onboardingPath} />;
    }
    if (isSignedIn) {
      return (
        <Navigate
          to={{ pathname: '/', hash: `connect/choose-account?${search}` }}
          screenPath={ScreenPaths.CHOOSE_ACCOUNT}
        />
      );
    }
    return <Create next={() => doChangeScreen(ScreenPaths.SECRET_KEY)} />;
  };

  const getUsernameElement = () => {
    if (onboardingPath) {
      return <Username />;
    }
    if (isSignedIn) {
      return <Navigate to={ScreenPaths.CHOOSE_ACCOUNT} screenPath={ScreenPaths.CHOOSE_ACCOUNT} />;
    }
    return <Username />;
  };

  return (
    <RoutesDom>
      <Route path="/" element={<Home />} />
      {/*Sign Up*/}
      <Route path="/sign-up" element={getSignUpElement()} />
      <Route
        path="/sign-up/secret-key"
        element={<SecretKey next={() => doChangeScreen(ScreenPaths.SAVE_KEY)} />}
      />
      <Route
        path="/sign-up/save-secret-key"
        element={
          <SaveKey
            next={() => {
              doChangeScreen(ScreenPaths.USERNAME);
            }}
          />
        }
      />
      <Route path="/sign-up/username" element={getUsernameElement()} />
      {/*Sign In*/}
      <Route
        path="/sign-in"
        element={
          isSignedIn ? (
            <Navigate to={ScreenPaths.CHOOSE_ACCOUNT} screenPath={ScreenPaths.CHOOSE_ACCOUNT} />
          ) : (
            <SignIn
              next={() => doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT)}
              back={() => doChangeScreen(ScreenPaths.SECRET_KEY)}
            />
          )
        }
      />
      <Route
        path="/sign-in/recover"
        element={<DecryptRecoveryCode next={() => doChangeScreen(ScreenPaths.CHOOSE_ACCOUNT)} />}
      />
      <Route path="/sign-in/add-account" element={<Username />} />;
      <Route
        path="/connect/choose-account"
        element={
          <ChooseAccount
            next={(identityIndex: number) => {
              doFinishSignIn({ identityIndex });
            }}
          />
        }
      />
      {/* Transactions */}
      <Route path="/transaction" element={<Transaction />} />
      {/*Error/Misc*/}
      <Route
        path="/settings/secret-key"
        element={<SecretKey next={() => doChangeScreen(ScreenPaths.HOME)} />}
      />
    </RoutesDom>
  );
};
