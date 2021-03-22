import { useRecoilCallback } from 'recoil';
import { transactionPayloadStore } from '@store/recoil/transaction';
import {
  currentNetworkKeyStore,
  currentNetworkStore,
  Network,
  networksStore,
} from '@store/recoil/networks';

export function useNetworkSwitchCallback() {
  return useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const payload = await snapshot.getPromise(transactionPayloadStore);
      if (!payload || !payload.network) return;

      let foundNetwork = false;

      const [currentNetwork, networks] = await Promise.all([
        snapshot.getPromise(currentNetworkStore),
        snapshot.getPromise(networksStore),
      ]);

      // try to find an exact url match
      if (payload.network.coreApiUrl !== currentNetwork.url) {
        const newNetworkKey = Object.keys(networks).find(key => {
          const network = networks[key] as Network;
          return network.url === payload.network?.coreApiUrl;
        });

        if (newNetworkKey) {
          console.debug('Changing to new network to match node URL', newNetworkKey);
          set(currentNetworkKeyStore, newNetworkKey);
          foundNetwork = true;
        }
      }
      // try to find a network that matches chain id
      if (!foundNetwork && payload.network.chainId !== currentNetwork.chainId) {
        const newNetworkKey = Object.keys(networks).find(key => {
          const network = networks[key] as Network;
          return network.chainId === payload.network?.chainId;
        });

        if (newNetworkKey) {
          console.debug('Changing to new network from chainID', newNetworkKey);
          set(currentNetworkKeyStore, newNetworkKey);
          return;
        }
      }
    },
    []
  );
}
