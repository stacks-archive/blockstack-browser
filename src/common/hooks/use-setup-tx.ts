import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { usePrevious } from '@stacks/ui';

import { requestTokenStore } from '@store/recoil/transaction';
import { currentAccountStxAddressStore } from '@store/recoil/wallet';

import { useAccountSwitchCallback } from '@common/hooks/callbacks/use-account-switch-callback';
import { usePostConditionsCallback } from '@common/hooks/callbacks/use-post-conditions-callback';
import { useNetworkSwitchCallback } from '@common/hooks/callbacks/use-network-switch-callback';
import { useDecodeRequestCallback } from '@common/hooks/callbacks/use-decode-request-callback';

export const useSetupTx = () => {
  const currentAccountStxAddress = useRecoilValue(currentAccountStxAddressStore);
  const previousAccountStxAddress = usePrevious(currentAccountStxAddress);
  const requestToken = useRecoilValue(requestTokenStore);

  const handleDecodeRequest = useDecodeRequestCallback();
  const handleNetworkSwitch = useNetworkSwitchCallback();
  const handleAccountSwitch = useAccountSwitchCallback();
  const handlePostConditions = usePostConditionsCallback();

  useEffect(() => {
    if (!requestToken) {
      void handleDecodeRequest();
    }
  }, [requestToken, handleDecodeRequest]);

  useEffect(() => {
    void handleNetworkSwitch();
    void handleAccountSwitch();
  }, [requestToken, handleNetworkSwitch, handleAccountSwitch]);

  useEffect(() => {
    if (currentAccountStxAddress) {
      if (!previousAccountStxAddress || previousAccountStxAddress !== currentAccountStxAddress) {
        void handlePostConditions(currentAccountStxAddress);
      }
    }
  }, [previousAccountStxAddress, requestToken, currentAccountStxAddress, handlePostConditions]);
};
