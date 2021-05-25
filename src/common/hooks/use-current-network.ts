import { useRecoilValue } from 'recoil';
import { currentNetworkState } from '@store/networks';
import { useMemo } from 'react';
import { ChainID } from '@stacks/transactions';

type Modes = 'testnet' | 'mainnet';

export function useCurrentNetwork() {
  const network = useRecoilValue(currentNetworkState);
  const isTestnet = useMemo(() => network.chainId === ChainID.Testnet, [network.chainId]);
  const mode = (isTestnet ? 'testnet' : 'mainnet') as Modes;
  return {
    ...network,
    isTestnet,
    mode,
  };
}
