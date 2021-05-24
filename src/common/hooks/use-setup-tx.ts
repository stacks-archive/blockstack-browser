import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { usePrevious } from '@stacks/ui';

import { requestTokenStore, transactionPayloadStore } from '@store/transaction';
import { currentAccountStxAddressStore } from '@store/accounts';
import { hasRehydratedVaultStore } from '@store/wallet';

import { useAccountSwitchCallback } from '@common/hooks/callbacks/use-account-switch-callback';
import { usePostConditionsCallback } from '@common/hooks/callbacks/use-post-conditions-callback';
import { useNetworkSwitchCallback } from '@common/hooks/callbacks/use-network-switch-callback';
import { useDecodeRequestCallback } from '@common/hooks/callbacks/use-decode-request-callback';

export const useSetupTx = () => {
  const hasRehydratedVault = useRecoilValue(hasRehydratedVaultStore);

  const [hasMounted, setHasMounted] = useState(false);
  const currentAccountStxAddress = useRecoilValue(currentAccountStxAddressStore);
  const previousAccountStxAddress = usePrevious(currentAccountStxAddress);
  const requestToken = useRecoilValue(requestTokenStore);
  const payload = useRecoilValue(transactionPayloadStore);

  const handleDecodeRequest = useDecodeRequestCallback();
  const handleNetworkSwitch = useNetworkSwitchCallback();
  const handleAccountSwitch = useAccountSwitchCallback();
  const handlePostConditions = usePostConditionsCallback();

  const handleInit = useCallback(async () => {
    if (!hasRehydratedVault) return;
    if (!requestToken) {
      await handleDecodeRequest();
    }
    if (payload) {
      await Promise.all([handleNetworkSwitch(), handleAccountSwitch()]);
      if (requestToken && currentAccountStxAddress) {
        if (
          !hasMounted ||
          !previousAccountStxAddress ||
          previousAccountStxAddress !== currentAccountStxAddress
        ) {
          if (!hasMounted) {
            setHasMounted(true);
          }
          await handlePostConditions(true);
        }
      }
    }
  }, [
    hasRehydratedVault,
    hasMounted,
    payload,
    requestToken,
    previousAccountStxAddress,
    setHasMounted,
    currentAccountStxAddress,
    handlePostConditions,
    handleDecodeRequest,
    handleNetworkSwitch,
    handleAccountSwitch,
  ]);

  useEffect(() => {
    void handleInit();
  }, [
    payload,
    handleInit,
    hasMounted,
    previousAccountStxAddress,
    currentAccountStxAddress,
    handlePostConditions,
    requestToken,
    handleDecodeRequest,
    handleNetworkSwitch,
    handleAccountSwitch,
  ]);

  return !!(requestToken && payload && hasMounted);
};
