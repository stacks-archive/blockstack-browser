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
  const dispatch = useConnectDispatch();

  const doUpdateAuthOptions = (payload: Partial<AuthOptions>) => {
    return dispatch({ type: States.UPDATE_AUTH_OPTIONS, payload });
  };

  const doOpenAuth = (signIn?: boolean, opts?: Partial<AuthOptions>) => {
    if (signIn) {
      const options: AuthOptions = {
        ...authOptions,
        ...opts,
        sendToSignIn: true,
      };
      void authenticate(options);
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
    });
  };

  const doContractCall = (opts: ContractCallOptions) =>
    openContractCall({
      ...opts,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });

  const doContractDeploy = (opts: ContractDeployOptions) =>
    openContractDeploy({
      ...opts,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });

  const doSTXTransfer = (opts: STXTransferOptions) =>
    openSTXTransfer({
      ...opts,
      authOrigin: authOptions.authOrigin,
      appDetails: authOptions.appDetails,
    });

  return {
    isOpen,
    isAuthenticating,
    authData,
    authOptions,
    userSession,
    doOpenAuth,
    doAuth,
    authenticate,
    doContractCall,
    doContractDeploy,
    doSTXTransfer,
  };
};
