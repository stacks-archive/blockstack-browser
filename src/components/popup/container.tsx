import React, { memo, useCallback, useEffect } from 'react';
import { Flex, color, Spinner } from '@stacks/ui';
import { SettingsPopover } from './settings-popover';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnCancel } from '@common/hooks/use-on-cancel';
import { usePendingTransaction } from '@common/hooks/transaction/use-pending-transaction';
import { useAuthRequest } from '@common/hooks/auth/use-auth-request';

interface PopupHomeProps {
  header?: any;
  requestType?: string;
}

const Loading = memo(() => (
  <Flex width="100%" alignItems="center" justifyContent="center" flexGrow={1}>
    <Spinner color={color('text-caption')} />
  </Flex>
));

export const PopupContainer: React.FC<PopupHomeProps> = memo(
  ({ children, header, requestType }) => {
    const pendingTx = usePendingTransaction();
    const { authRequest } = useAuthRequest();
    const handleCancelTransaction = useOnCancel();
    const { handleCancelAuthentication, hasRehydratedVault } = useWallet();

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
          {hasRehydratedVault ? children : <Loading />}
        </Flex>
      </Flex>
    );
  }
);
