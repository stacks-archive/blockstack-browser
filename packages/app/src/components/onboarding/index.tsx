import React, { useEffect } from 'react';
import { ChooseAccount, Create, SaveKey, SecretKey, SignIn, Username } from './screens';
import { DecryptRecoveryCode } from './screens/decrypt-recovery-code';
import { doChangeScreen, doSaveAuthRequest } from '@store/onboarding/actions';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '@store';
import { ScreenName } from '@store/onboarding/types';
import { doFinishSignIn as finishSignIn } from '@store/onboarding/actions';
import { selectCurrentScreen } from '@store/onboarding/selectors';
import { authenticationInit } from '@common/utils';
import { UsernameRegistryError } from './screens/registery-error';

const RenderScreen = ({ ...rest }) => {
  const dispatch = useDispatch();
  const { screen } = useSelector((state: AppState) => ({
    screen: selectCurrentScreen(state),
  }));

  // const doFinishSignIn = async (identityIndex = 0, identity?: Identity) => {
  const doFinishSignIn = ({ identityIndex }: { identityIndex: number } = { identityIndex: 0 }) => {
    dispatch(finishSignIn({ identityIndex }));
  };

  /**
   * TODO: make this check if logged in better
   */
  // React.useEffect(() => {
  //   if (screen !== ScreenName.CHOOSE_ACCOUNT && identities && identities.length) {
  //     dispatch(doChangeScreen(ScreenName.CHOOSE_ACCOUNT));
  //   }
  // }, [screen, identities]);

  const ChooseScreen = () => (
    <ChooseAccount
      next={(identityIndex: number) => {
        doFinishSignIn({ identityIndex });
      }}
      {...rest}
    />
  );

  const usernameNext = () => dispatch(doChangeScreen(ScreenName.GENERATION));

  switch (screen) {
    // username
    case ScreenName.USERNAME:
      return <Username next={usernameNext} {...rest} />;

    case ScreenName.ADD_ACCOUNT:
      return <Username next={usernameNext} {...rest} />;

    // create
    case ScreenName.GENERATION:
      return <Create next={() => dispatch(doChangeScreen(ScreenName.SECRET_KEY))} {...rest} />;

    // Key screens
    case ScreenName.SECRET_KEY:
      return <SecretKey next={() => dispatch(doChangeScreen(ScreenName.SAVE_KEY))} {...rest} />;

    case ScreenName.SAVE_KEY:
      return (
        <SaveKey
          next={() => {
            dispatch(doChangeScreen(ScreenName.USERNAME));
          }}
          {...rest}
        />
      );

    // Sign In
    case ScreenName.SIGN_IN:
      return (
        <SignIn
          next={() => doChangeScreen(ScreenName.CHOOSE_ACCOUNT)}
          back={() => {
            dispatch(doChangeScreen(ScreenName.SECRET_KEY));
          }}
          {...rest}
        />
      );

    case ScreenName.CHOOSE_ACCOUNT:
      return <ChooseScreen />;

    case ScreenName.RECOVERY_CODE:
      return <DecryptRecoveryCode next={() => doChangeScreen(ScreenName.CHOOSE_ACCOUNT)} />;

    case ScreenName.REGISTRY_ERROR:
      return <UsernameRegistryError />;

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
