import { useContext } from 'react';
import {
  authenticate,
  AuthOptions,
  ContractCallOptions,
  ContractDeployOptions,
  STXTransferOptions,
  openContractCall,
  openContractDeploy,
  openSTXTransfer,
  showBlockstackConnect,
  FinishedData,
} from '@stacks/connect';
import { ConnectContext, ConnectDispatchContext, States } from '../components/connect/context';

const useConnectDispatch = () => {
  const dispatch = useContext(ConnectDispatchContext);
  if (!dispatch) {
    throw new Error('This must be used within the ConnectProvider component.');
  }
  return dispatch;
};

export const useConnect = () => {
  const { isOpen, isAuthenticating, authData, authOptions, userSession } = useContext(
    ConnectContext
  );
  const finishedCallback = authOptions.onFinish || authOptions.finished;
  const dispatch = useConnectDispatch();

  const doUpdateAuthOptions = (payload: Partial<AuthOptions>) => {
    return dispatch({ type: States.UPDATE_AUTH_OPTIONS, payload });
  };

  /**
   *
   * @param signIn Whether the user should be sent to sign in
   * @param options
   */
  const doOpenAuth = (signIn?: boolean, options?: Partial<AuthOptions>) => {
    if (signIn) {
      const _options: AuthOptions = {
        ...authOptions,
        ...options,
        finished: undefined,
        onFinish: (payload: FinishedData) => {
          finishedCallback?.(payload);
        },
        sendToSignIn: true,
      };
      void authenticate(_options);
      return;
    } else {
      showBlockstackConnect({
        ...authOptions,
        sendToSignIn: false,
      });
    }
    authOptions && doUpdateAuthOptions(authOptions);
  };
  const doAuth = (options: Partial<AuthOptions> = {}) => {
    void authenticate({
      ...authOptions,
      ...options,
      finished: undefined,
      onFinish: (payload: FinishedData) => {
        finishedCallback?.(payload);
      },
    });
  };

  const doContractCall = (options: ContractCallOptions) =>
    openContractCall({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });

  const doContractDeploy = (options: ContractDeployOptions) =>
    openContractDeploy({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });

  const doSTXTransfer = (options: STXTransferOptions) =>
    openSTXTransfer({
      ...options,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });

  return {
    isOpen,
    isAuthenticating,
    authData,
    authOptions,
    screen,
    userSession,
    doOpenAuth,
    doAuth,
    authenticate,
    doContractCall,
    doContractDeploy,
    doSTXTransfer,
  };
};
