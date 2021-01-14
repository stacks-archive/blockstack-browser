import React, { useEffect, useState, useCallback } from 'react';
import { Box, Flex, Button, Text } from '@stacks/ui';
import { BaseDrawer, BaseDrawerProps } from './index';
import {
  StacksTransaction,
  makeSTXTokenTransfer,
  broadcastTransaction,
  makeContractCall,
  standardPrincipalCVFromAddress,
  uintCV,
  createAddress,
  makeStandardFungiblePostCondition,
  FungibleConditionCode,
  PostCondition,
  createAssetInfo,
} from '@stacks/transactions';
import { StacksTestnet } from '@stacks/network';
import { useWallet } from '@common/hooks/use-wallet';
import BN from 'bn.js';
import { stacksValue, stxToMicroStx } from '@common/stacks-utils';
import { useAnalytics } from '@common/hooks/use-analytics';
import { ScreenPaths } from '@store/onboarding/types';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { selectedAssetStore } from '@store/recoil/asset-search';
import { getAssetStringParts } from '@stacks/ui-utils';
import { currentAccountStore } from '@store/recoil/wallet';
import { currentNetworkStore } from '@store/recoil/networks';
import { accountBalancesStore, apiRevalidation } from '@store/recoil/api';

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
  const { doSetLatestNonce, currentAccountStxAddress, currentNetwork } = useWallet();
  const [loading, setLoading] = useState(false);
  const asset = useRecoilValue(selectedAssetStore);
  const setApiRevalidation = useSetRecoilState(apiRevalidation);
  const { doChangeScreen } = useAnalytics();

  const getTx = useRecoilCallback(
    ({ snapshot }) => async () => {
      const asset = await snapshot.getPromise(selectedAssetStore);
      const currentAccount = await snapshot.getPromise(currentAccountStore);
      const currentNetwork = await snapshot.getPromise(currentNetworkStore);
      const balances = await snapshot.getPromise(accountBalancesStore);
      if (!asset || !currentAccount || !currentAccountStxAddress) return;
      const network = new StacksTestnet();
      network.coreApiUrl = currentNetwork.url;
      setLoading(true);
      if (asset.type === 'stx') {
        const mStx = stxToMicroStx(amount);
        const _tx = await makeSTXTokenTransfer({
          recipient,
          amount: new BN(mStx.toString(), 10),
          senderKey: currentAccount.stxPrivateKey,
          network,
        });
        setTx(_tx);
      } else {
        const { address: contractAddress, contractName, assetName } = getAssetStringParts(
          asset.contractAddress
        );
        const functionName = 'transfer';
        const postConditions: PostCondition[] = [];
        const tokenBalanceKey = Object.keys(balances?.fungible_tokens || {}).find(contract => {
          return contract.startsWith(asset?.contractAddress);
        });
        if (tokenBalanceKey) {
          const assetInfo = createAssetInfo(contractAddress, contractName, assetName);
          const pc = makeStandardFungiblePostCondition(
            currentAccountStxAddress,
            FungibleConditionCode.Equal,
            new BN(amount, 10),
            assetInfo
          );
          postConditions.push(pc);
        }
        const _tx = await makeContractCall({
          network,
          functionName,
          functionArgs: [standardPrincipalCVFromAddress(createAddress(recipient)), uintCV(amount)],
          senderKey: currentAccount.stxPrivateKey,
          contractAddress,
          contractName,
          postConditions,
        });
        setTx(_tx);
      }
      setLoading(false);
    },
    [amount, recipient, currentAccountStxAddress]
  );

  useEffect(() => {
    if (!showing) {
      return;
    }
    void getTx();
  }, [getTx, showing]);

  const submit = useCallback(async () => {
    setLoading(true);
    const network = new StacksTestnet();
    network.coreApiUrl = currentNetwork.url;
    if (!tx) {
      return;
    }
    await broadcastTransaction(tx, network);
    doSetLatestNonce(tx);
    setApiRevalidation(current => (current as number) + 1);
    setLoading(false);
    close();
    doChangeScreen(ScreenPaths.POPUP_HOME);
  }, [tx, currentNetwork.url, close, doChangeScreen, doSetLatestNonce, setApiRevalidation]);

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
        <Text fontSize={2}>
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
      {tx ? (
        <Box width="100%" px={6} mt="base">
          <Divider />
          <Text fontSize={2} fontWeight="500" display="block" mb="extra-tight">
            Fee
          </Text>
          <Text fontSize={2}>
            {stacksValue({
              value: tx.auth.spendingCondition?.fee?.toNumber() || 0,
            })}
          </Text>
        </Box>
      ) : null}
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
          isLoading={loading}
        >
          Send
        </Button>
      </Flex>
    </BaseDrawer>
  );
};
