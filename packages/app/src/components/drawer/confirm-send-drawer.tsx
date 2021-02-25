import React, { useEffect, useState, useCallback } from 'react';
import { Box, Flex, Button, Text } from '@stacks/ui';
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

const Divider: React.FC = () => <Box height="1px" backgroundColor="ink.150" my="base" />;

interface ConfirmSendDrawerProps extends BaseDrawerProps {
  amount: number;
  recipient: string;
}

export const ConfirmSendDrawer: React.FC<ConfirmSendDrawerProps> = ({
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
    <BaseDrawer showing={showing} close={close}>
      <Box width="100%" px={6}>
        <Text fontSize={4} fontWeight="600">
          Confirm transfer
        </Text>
      </Box>
      <Box width="100%" px={6} mt="base">
        <Divider />
        <Text fontSize={2} fontWeight="500" display="block" mb="extra-tight">
          Amount
        </Text>
        <Text fontSize={1}>
          {amount}
          {asset?.type === 'stx' ? ' STX' : ''}
        </Text>
      </Box>
      <Box width="100%" px={6} mt="base">
        <Divider />
        <Text fontSize={2} fontWeight="500" display="block" mb="extra-tight">
          To
        </Text>
        <Text fontSize={1} overflowWrap="break-word">
          {recipient}
        </Text>
      </Box>
      <Box width="100%" px={6} mt="base">
        <Divider />
        <Text fontSize={2} fontWeight="500" display="block" mb="extra-tight">
          Nonce
        </Text>
        {tx ? (
          <Text fontSize={1}>{tx.auth.spendingCondition?.nonce.toNumber()}</Text>
        ) : (
          <LoadingRectangle height="14px" width="80px" />
        )}
      </Box>
      <Box width="100%" px={6} mt="base">
        <Divider />
        <Text fontSize={2} fontWeight="500" display="block" mb="extra-tight">
          Fee
        </Text>
        {tx ? (
          <Text fontSize={1}>
            {stacksValue({
              value: tx.auth.spendingCondition?.fee?.toNumber() || 0,
            })}
          </Text>
        ) : (
          <LoadingRectangle height="14px" width="80px" />
        )}
      </Box>
      <Flex width="100%" px="6" flexGrow={1} mt="base">
        <Button width="50%" mode="secondary" mr={2} onClick={close}>
          Cancel
        </Button>
        <Button
          width="50%"
          mode="primary"
          ml={2}
          isDisabled={!tx || loading}
          onClick={submit}
          isLoading={!tx || loading}
        >
          Send
        </Button>
      </Flex>
    </BaseDrawer>
  );
};
