import React, { memo, useCallback, useEffect } from 'react';
import { Flex, color, Button } from '@stacks/ui';
import { SettingsPopover } from './settings-popover';
import { useRecoilValue } from 'recoil';
import { hasRehydratedVaultStore } from '@store/wallet';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnCancel } from '@common/hooks/use-on-cancel';
import { usePendingTransaction } from '@common/hooks/transaction/use-pending-transaction';
import { useAuthRequest } from '@common/hooks/auth/use-auth-request';

interface PopupHomeProps {
  header?: any;
  requestType?: string;
}

export const PopupContainer: React.FC<PopupHomeProps> = memo(
  ({ children, header, requestType }) => {
    const hasRehydratedVault = useRecoilValue(hasRehydratedVaultStore);
    const pendingTx = usePendingTransaction();
    const { authRequest } = useAuthRequest();
    const handleCancelTransaction = useOnCancel();
    const { handleCancelAuthentication } = useWallet();

    if (!hasRehydratedVault) {
      console.error('No hasRehydratedVault, rendered null');
    }

    /*
     * When the popup is closed, this checks the requestType and forces
     * the request promise to fail; triggering an onCancel callback function.
     */
    const handleUnmount = useCallback(async () => {
      if (requestType === 'transaction' || !!pendingTx) {
        await handleCancelTransaction();
      } else if (requestType === 'auth' || !!authRequest) {
        handleCancelAuthentication();
      }
    }, [requestType, handleCancelAuthentication, authRequest, pendingTx, handleCancelTransaction]);

    useEffect(() => {
      window.addEventListener('beforeunload', handleUnmount);
      return () => window.removeEventListener('beforeunload', handleUnmount);
    }, [handleUnmount]);

    return (
      <Flex
        flexDirection="column"
        flexGrow={1}
        width="100%"
        background={color('bg')}
        data-test="container-outer"
        minHeight="100vh"
        maxHeight="100vh"
        position="relative"
        overflow="auto"
      >
        {header && header}
        <SettingsPopover />
        <Button onClick={() => handleUnmount()}>cancel</Button>
        <Flex
          flexDirection="column"
          flexGrow={1}
          className="main-content"
          as="main"
          position="relative"
          width="100%"
          px="loose"
          pb="loose"
        >
          {/*TODO: this seems like a bug, I think it could cause a blank screen some time*/}
          {hasRehydratedVault ? children : null}
        </Flex>
      </Flex>
    );
  }
);
