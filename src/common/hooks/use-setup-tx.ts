import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  transactionPayloadStore,
  postConditionsStore,
  requestTokenStore,
} from '@store/recoil/transaction';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import {
  currentNetworkStore,
  networksStore,
  Network,
  currentNetworkKeyStore,
} from '@store/recoil/networks';
import {
  currentAccountIndexStore,
  walletStore,
  currentAccountStxAddressStore,
} from '@store/recoil/wallet';
import { getStxAddress } from '@stacks/wallet-sdk';
import {
  PostCondition,
  parsePrincipalString,
  deserializePostCondition,
  BufferReader,
} from '@stacks/transactions';

export const useSetupTx = () => {
  const currentAccountStxAddress = useRecoilValue(currentAccountStxAddressStore);
  const requestToken = useRecoilValue(requestTokenStore);
  const location = useLocation();

  const decodeRequest = useRecoilCallback(
    ({ set }) => () => {
      const urlParams = new URLSearchParams(location.search);
      const requestToken = urlParams.get('request');
      if (requestToken) {
        set(requestTokenStore, requestToken);
      } else if (!requestToken) {
        console.error('Unable to find contract call parameter');
        throw 'Invalid transaction request parameter';
      }
    },
    [location.search]
  );

  useEffect(() => {
    decodeRequest();
  }, [decodeRequest]);

  const handleNetworkSwitch = useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const payload = await snapshot.getPromise(transactionPayloadStore);
      if (!payload?.network) return;
      const currentNetwork = await snapshot.getPromise(currentNetworkStore);
      const networks = await snapshot.getPromise(networksStore);
      let foundNetwork = false;
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

  /**
   * Apps can specify a `stxAddress` in a transaction request.
   * If the user has a matching account, use that account by default.
   */
  const handleAccountSwitch = useRecoilCallback(
    ({ snapshot, set }) => async () => {
      const payload = await snapshot.getPromise(transactionPayloadStore);
      if (!payload?.stxAddress || !payload.network) return;
      const wallet = await snapshot.getPromise(walletStore);
      if (!wallet) return;
      const transactionVersion = payload.network.version;
      let foundIndex: number | undefined = undefined;
      wallet.accounts.forEach((account, index) => {
        const address = getStxAddress({ account, transactionVersion });
        if (address === payload.stxAddress) {
          foundIndex = index;
        }
      });
      if (foundIndex !== undefined) {
        console.debug('switching to index', foundIndex);
        set(currentAccountIndexStore, foundIndex);
      } else {
        console.warn(
          'No account matches the STX address provided in transaction request:',
          payload.stxAddress
        );
      }
    },
    []
  );

  useEffect(() => {
    void handleNetworkSwitch();
    void handleAccountSwitch();
  }, [requestToken, handleNetworkSwitch, handleAccountSwitch]);

  const handlePostConditions = useRecoilCallback(
    ({ snapshot, set }) => async (currentAddress?: string) => {
      const payload = await snapshot.getPromise(transactionPayloadStore);
      if (!payload) return;
      if (!currentAddress) return;
      const existingPostConditions = await snapshot.getPromise(postConditionsStore);
      // change existing post conditions to current account
      if (existingPostConditions.length) {
        console.debug('Swapping post conditions address');
        const newConditions: PostCondition[] = existingPostConditions.map(postCondition => {
          return {
            ...postCondition,
            principal: parsePrincipalString(currentAddress),
          };
        });
        set(postConditionsStore, newConditions);
        return;
      } else if (payload.postConditions?.length) {
        console.debug('Setting up post conditions for transaction request');
        const newConditions: PostCondition[] = payload.postConditions.map(postCondition => {
          let payloadCondition: PostCondition;
          if (typeof postCondition === 'string') {
            const reader = BufferReader.fromBuffer(Buffer.from(postCondition, 'hex'));
            payloadCondition = deserializePostCondition(reader);
          } else {
            payloadCondition = { ...postCondition };
          }
          // override principal with current user
          const newCondition = {
            ...payloadCondition,
            principal: parsePrincipalString(currentAddress),
          };
          return newCondition;
        });
        set(postConditionsStore, newConditions);
      }
    },
    []
  );

  useEffect(() => {
    void handlePostConditions(currentAccountStxAddress);
  }, [requestToken, currentAccountStxAddress, handlePostConditions]);
};
