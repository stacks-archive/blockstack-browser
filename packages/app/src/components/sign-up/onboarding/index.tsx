import React, { useState, useEffect } from 'react';
import { Create, SecretKey, Connect, SaveKey, SignIn } from './screens';
import { DecryptRecoveryCode } from './screens/decrypt-recovery-code';
import { doChangeScreen, doSaveAuthRequest } from '../../../store/onboarding/actions';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState } from '../../../store';
import { ScreenName } from '../../../store/onboarding/types';
import { selectCurrentWallet } from '../../../store/wallet/selectors';
import { selectCurrentScreen, selectDecodedAuthRequest, selectAuthRequest } from '../../../store/onboarding/selectors';
import { authenticationInit, finalizeAuthResponse } from '../../../common/utils';

const RenderScreen = ({ ...rest }) => {
  const dispatch = useDispatch();
  const { screen, wallet, decodedAuthRequest, authRequest } = useSelector((state: IAppState) => ({
    screen: selectCurrentScreen(state),
    wallet: selectCurrentWallet(state),
    decodedAuthRequest: selectDecodedAuthRequest(state),
    authRequest: selectAuthRequest(state),
  }));

  // TODO
  const doFinishSignIn = async () => {
    if (!wallet || !decodedAuthRequest || !authRequest) {
      console.error('Uh oh! Finished onboarding without auth info.');
      return;
    }
    const gaiaUrl = 'https://hub.blockstack.org';
    const appURL = new URL(decodedAuthRequest.redirect_uri);
    await wallet.identities[0].refresh();
    const authResponse = await wallet.identities[0].makeAuthResponse({
      gaiaUrl,
      appDomain: appURL.origin,
      transitPublicKey: decodedAuthRequest.public_keys[0],
    });
    finalizeAuthResponse({ decodedAuthRequest, authRequest, authResponse });
  };
  const doFinishOnboarding = doFinishSignIn;

  const [hasSaved, setHasSaved] = useState(false);
  switch (screen) {
    // create
    case ScreenName.CREATE:
      return <Create next={() => dispatch(doChangeScreen(ScreenName.SECRET_KEY))} {...rest} />;

    // Key screens
    case ScreenName.SECRET_KEY:
      return (
        <SecretKey
          next={() => dispatch(doChangeScreen(hasSaved ? ScreenName.CONNECT_APP : ScreenName.SAVE_KEY))}
          {...rest}
        />
      );

    case ScreenName.SAVE_KEY:
      return (
        <SaveKey
          next={() => {
            setHasSaved(true);
            dispatch(doChangeScreen(ScreenName.CONNECT_APP));
          }}
          {...rest}
        />
      );

    // Connect
    case ScreenName.CONNECT_APP:
      return (
        <Connect
          next={async () => {
            await doFinishOnboarding();
          }}
          back={() => dispatch(doChangeScreen(ScreenName.SECRET_KEY))}
          {...rest}
        />
      );

    // Sign In
    case ScreenName.SIGN_IN:
      return (
        <SignIn
          next={async () => await doFinishSignIn()}
          back={() => {
            dispatch(doChangeScreen(ScreenName.SECRET_KEY));
          }}
          {...rest}
        />
      );

    case ScreenName.RECOVERY_CODE:
      return <DecryptRecoveryCode next={async () => await doFinishSignIn()} />;

    default:
      return null;
  }
};

const Onboarding: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const authRequest = authenticationInit();
    if (authRequest) {
      dispatch(doSaveAuthRequest(authRequest));
    }
  }, []);
  return <RenderScreen />;
};

export { Onboarding };
