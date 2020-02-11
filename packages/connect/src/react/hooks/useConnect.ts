import { useContext } from 'react';
import { authenticate, AuthOptions, FinishedData } from '../../auth';
import { ConnectContext, ConnectDispatchContext, States } from '../components/connect/context';

const useConnectDispatch = () => {
  const dispatch = useContext(ConnectDispatchContext);
  if (!dispatch) {
    throw new Error('This must be used within the ConnectProvider component.');
  }
  return dispatch;
};

export const useConnect = () => {
  const { isOpen, isAuthenticating, authData, screen, authOptions } = useContext(ConnectContext);
  const dispatch = useConnectDispatch();

  const doUpdateAuthOptions = (payload: Partial<AuthOptions>) => {
    return dispatch({ type: States.UPDATE_AUTH_OPTIONS, payload });
  };

  const doChangeScreen = (newScreen: string) => dispatch({ type: newScreen });
  const doGoToIntroScreen = () => doChangeScreen(States.SCREENS_INTRO);
  const doGoToHowItWorksScreen = () => doChangeScreen(States.SCREENS_HOW_IT_WORKS);
  const doGoToSignInScreen = () => doChangeScreen(States.SCREENS_SIGN_IN);
  const doGoToFinishedScreen = () => doChangeScreen(States.SCREENS_FINISHED);

  const doStartAuth = () => dispatch({ type: States.START_AUTH });
  const doFinishAuth = (payload: FinishedData) => {
    doGoToFinishedScreen();
    dispatch({ type: States.FINISH_AUTH, payload });
  };
  const doCancelAuth = () => dispatch({ type: States.CANCEL_AUTH });

  const doOpenDataVault = (signIn?: boolean, opts?: Partial<AuthOptions>) => {
    if (signIn) {
      const options = {
        ...authOptions,
        ...opts,
        finished: (payload: FinishedData) => {
          doFinishAuth(payload);
          authOptions.finished && authOptions.finished(payload);
        },
        sendToSignIn: true,
      };
      doStartAuth();
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      authenticate(options);
      return;
    }
    authOptions && doUpdateAuthOptions(authOptions);
    dispatch({ type: States.MODAL_OPEN });
  };
  const doCloseDataVault = () => {
    dispatch({ type: States.MODAL_CLOSE });
    setTimeout(doGoToIntroScreen, 250);
  };
  const doAuth = (options: Partial<AuthOptions> = {}) => {
    doStartAuth();
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    authenticate({
      ...authOptions,
      ...options,
      finished: payload => {
        authOptions.finished && authOptions.finished(payload);
        doFinishAuth(payload);
      },
    });
  };

  return {
    isOpen,
    isAuthenticating,
    authData,
    authOptions,
    screen,
    doOpenDataVault,
    doCloseDataVault,
    doChangeScreen,
    doGoToIntroScreen,
    doGoToHowItWorksScreen,
    doGoToSignInScreen,
    doCancelAuth,
    doStartAuth,
    doFinishAuth,
    doAuth,
    authenticate,
  };
};
