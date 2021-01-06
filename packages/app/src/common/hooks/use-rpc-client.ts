import { useWallet } from './use-wallet';
import RPCClient from '@stacks/rpc-client';

export const useRpcClient = () => {
  const { currentNetwork } = useWallet();
  return new RPCClient(currentNetwork.url);
};
