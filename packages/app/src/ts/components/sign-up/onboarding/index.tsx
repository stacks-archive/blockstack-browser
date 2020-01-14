import React, { useState, useEffect } from 'react';
import { Modal } from '../modal';
import { Intro, HowItWorks, Create, SecretKey, Connect, SaveKey, Final, SignIn } from './screens';
import DecryptRecoveryCode from '@components/sign-up/onboarding/screens/decrypt-recovery-code';
import { doChangeScreen, doSaveAuthRequest } from '@store/onboarding/actions';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState } from '@store';
import { Screen } from '@store/onboarding/types';
import {
  selectCurrentScreen,
  selectDecodedAuthRequest,
  selectAuthRequest,
  selectAppIcon,
  selectAppName,
} from '@store/onboarding/selectors';
import { selectCurrentWallet } from '@store/wallet/selectors';
import { authenticationInit, finalizeAuthResponse } from '@common/utils';

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
      console.log('Uh oh! Finished onboarding without auth info.');
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
    // intro / about
    case Screen.INTRO:
      return <Intro next={() => dispatch(doChangeScreen(Screen.CREATE))} {...rest} />;

    case Screen.HOW_IT_WORKS:
      return <HowItWorks back={() => dispatch(doChangeScreen(Screen.INTRO))} {...rest} />;

    // create
    case Screen.CREATE:
      return <Create next={() => dispatch(doChangeScreen(Screen.SECRET_KEY))} {...rest} />;

    // Key screens
    case Screen.SECRET_KEY:
      return (
        <SecretKey next={() => dispatch(doChangeScreen(hasSaved ? Screen.CONNECT_APP : Screen.SAVE_KEY))} {...rest} />
      );

    case Screen.SAVE_KEY:
      return (
        <SaveKey
          next={() => {
            setHasSaved(true);
            dispatch(doChangeScreen(Screen.CONNECT_APP));
          }}
          {...rest}
        />
      );

    // Connect
    case Screen.CONNECT_APP:
      return (
        <Connect
          next={() => dispatch(doChangeScreen(Screen.CONNECTED))}
          back={() => dispatch(doChangeScreen(Screen.SECRET_KEY))}
          {...rest}
        />
      );

    case Screen.CONNECTED:
      return (
        <Final
          next={async () => {
            await doFinishOnboarding();
          }}
          back={() => dispatch(doChangeScreen(Screen.SECRET_KEY))}
          {...rest}
        />
      );

    // Sign In

    case Screen.SIGN_IN:
      return (
        <SignIn
          next={async () => await doFinishSignIn()}
          back={() => {
            dispatch(doChangeScreen(Screen.SECRET_KEY));
          }}
          {...rest}
        />
      );

    case Screen.RECOVERY_CODE:
      return <DecryptRecoveryCode next={async () => await doFinishSignIn()} />;

    default:
      return <Intro {...rest} />;
  }
};

const Onboarding: React.FC = () => {
  const dispatch = useDispatch();
  const appIcon = useSelector((state: IAppState) => selectAppIcon(state));
  const appName = useSelector((state: IAppState) => selectAppName(state));

  useEffect(() => {
    const authRequest = authenticationInit();
    if (authRequest) {
      dispatch(doSaveAuthRequest(authRequest));
    }
  }, []);
  return (
    <Modal
      appIcon={appIcon}
      appName={appName}
      close={() => {
        console.log('Close Modal');
      }}
      title="Data Vault"
    >
      <RenderScreen />
    </Modal>
  );
};

export { Onboarding };
