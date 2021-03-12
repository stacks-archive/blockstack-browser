import { useRecoilValue } from 'recoil';
import { currentNetworkStore } from '@store/recoil/networks';
import { useMemo } from 'react';
import { ChainID } from '@stacks/transactions';

type Modes = 'testnet' | 'mainnet';

export function useCurrentNetwork() {
  const network = useRecoilValue(currentNetworkStore);
  const isTestnet = useMemo(() => network.chainId === ChainID.Testnet, [network.chainId]);
  const mode = (isTestnet ? 'testnet' : 'mainnet') as Modes;
  return {
    ...network,
    isTestnet,
    mode,
  };
}
