import React, { useCallback, useEffect } from 'react';
import { Flex, color } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';
import { useOnCancel } from '@common/hooks/use-on-cancel';
import { usePendingTransaction } from '@pages/transaction-signing/hooks/use-pending-transaction';
import { useAuthRequest } from '@common/hooks/auth/use-auth-request';

interface PopupHomeProps {
  header?: any;
  // TODO: remove the need for prop drilling this
  requestType?: 'transaction' | 'auth';
}

const UnmountEffectSuspense = ({
  requestType,
}: {
  requestType?: PopupHomeProps['requestType'];
}) => {
  const pendingTx = usePendingTransaction();
  const { authRequest } = useAuthRequest();
  const handleCancelTransaction = useOnCancel();
  const { handleCancelAuthentication } = useWallet();

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

  return null;
};

const UnmountEffect = ({ requestType }: { requestType?: PopupHomeProps['requestType'] }) => (
  <React.Suspense fallback={<></>}>
    <UnmountEffectSuspense requestType={requestType} />
  </React.Suspense>
);

export const PopupContainer: React.FC<PopupHomeProps> = ({ children, header, requestType }) => {
  const { hasRehydratedVault } = useWallet();
  return hasRehydratedVault ? (
    <>
      <UnmountEffect requestType={requestType} />
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
        {header || null}
        <Flex
          flexDirection="column"
          flexGrow={1}
          className="main-content"
          id="main-content"
          as="main"
          position="relative"
          width="100%"
          px="loose"
          pb="loose"
        >
          {children}
        </Flex>
      </Flex>
    </>
  ) : null;
};
