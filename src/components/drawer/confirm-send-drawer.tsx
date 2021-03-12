import React, { useEffect, useState, useCallback } from 'react';
import { Button, Stack } from '@stacks/ui';
import { Text, Caption } from '@components/typography';
import { Tooltip } from '@components/tooltip';
import { BaseDrawer, BaseDrawerProps } from './index';
import { StacksTransaction, broadcastTransaction } from '@stacks/transactions';
import { useWallet } from '@common/hooks/use-wallet';
import { stacksValue } from '@common/stacks-utils';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { selectedAssetStore } from '@store/recoil/asset-search';
import { stacksNetworkStore } from '@store/recoil/networks';
import { LoadingRectangle } from '@components/loading-rectangle';
import { internalTransactionStore } from '@store/recoil/transaction';
import { correctNonceStore } from '@store/recoil/api';
import { truncateMiddle } from '@stacks/ui-utils';

interface ConfirmSendDrawerProps extends BaseDrawerProps {
  amount: number;
  recipient: string;
}

export const ConfirmSendDrawer: React.FC<Omit<ConfirmSendDrawerProps, 'title'>> = ({
  showing,
  close,
  amount,
  recipient,
}) => {
  const [tx, setTx] = useState<StacksTransaction | undefined>();
  const { doSetLatestNonce } = useWallet();
  const [loading, setLoading] = useState(false);
  const asset = useRecoilValue(selectedAssetStore);
  const stacksNetwork = useRecoilValue(stacksNetworkStore);
  const { doChangeScreen } = useAnalytics();

  const getTx = useRecoilCallback(
    ({ snapshot }) => async () => {
      try {
        const nonce = await snapshot.getPromise(correctNonceStore);
        const _tx = await snapshot.getPromise(internalTransactionStore([amount, recipient, nonce]));
        if (_tx) setTx(_tx);
        setLoading(false);
      } catch (e) {
        console.error('getTx falsed: ', e);
        setLoading(false);
      }
    },
    [amount, recipient]
  );

  useEffect(() => {
    if (!showing) return;
    void getTx();
  }, [getTx, showing]);

  const submit = useCallback(async () => {
    setLoading(true);

    if (!tx) return;
    await broadcastTransaction(tx, stacksNetwork);
    await doSetLatestNonce(tx);
    setLoading(false);
    close();
    doChangeScreen(ScreenPaths.POPUP_HOME);
  }, [tx, close, doChangeScreen, doSetLatestNonce, stacksNetwork]);

  return (
    <BaseDrawer title="Confirm transfer" showing={showing} close={close}>
      <Stack pt="tight" spacing="extra-loose">
        <Stack spacing="loose">
          <Stack width="100%" px="extra-loose">
            <Caption>Amount</Caption>
            <Text>
              {amount}
              {asset?.type === 'stx' ? ' STX' : ''}
            </Text>
          </Stack>
          <Stack width="100%" px="extra-loose">
            <Caption>Recipient</Caption>
            <Tooltip label={recipient}>
              <Text>{truncateMiddle(recipient, 12)}</Text>
            </Tooltip>
          </Stack>
          <Stack width="100%" px="extra-loose">
            <Caption>Nonce</Caption>
            {tx ? (
              <Text>{tx.auth.spendingCondition?.nonce.toNumber()}</Text>
            ) : (
              <LoadingRectangle height="14px" width="80px" />
            )}
          </Stack>
          <Stack width="100%" px="extra-loose">
            <Caption>Fee</Caption>
            {tx ? (
              <Text>
                {stacksValue({
                  value: tx.auth.spendingCondition?.fee?.toNumber() || 0,
                })}
              </Text>
            ) : (
              <LoadingRectangle height="14px" width="80px" />
            )}
          </Stack>
        </Stack>
        <Stack spacing="base" pb="loose" width="100%" px="extra-loose">
          <Button
            mode="primary"
            isDisabled={!tx || loading}
            onClick={submit}
            isLoading={!tx || loading}
          >
            Send
          </Button>
          <Button mode="tertiary" onClick={close}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </BaseDrawer>
  );
};
