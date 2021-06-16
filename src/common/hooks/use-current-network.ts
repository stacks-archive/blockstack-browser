import { currentNetworkState } from '@store/networks';
import { useMemo } from 'react';
import { ChainID } from '@stacks/transactions';
import { useAtomValue } from 'jotai/utils';

type Modes = 'testnet' | 'mainnet';

export function useCurrentNetwork() {
  const network = useAtomValue(currentNetworkState);
  const isTestnet = useMemo(() => network.chainId === ChainID.Testnet, [network.chainId]);
  const mode = (isTestnet ? 'testnet' : 'mainnet') as Modes;
  return {
    ...network,
    isTestnet,
    mode,
  };
}
