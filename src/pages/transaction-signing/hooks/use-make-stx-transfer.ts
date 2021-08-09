import { useAtomCallback, waitForAll } from 'jotai/utils';
import { currentStacksNetworkState } from '@store/networks';
import { currentAccountState, currentAccountStxAddressState } from '@store/accounts';
import { correctNonceState } from '@store/accounts/nonce';
import { AnchorMode, makeSTXTokenTransfer, StacksTransaction } from '@stacks/transactions';
import BN from 'bn.js';
import { stxToMicroStx } from '@stacks/ui-utils';
import { useLoading } from '@common/hooks/use-loading';
import { useCallback, useEffect } from 'react';
import { useMakeAssetTransfer } from '@pages/transaction-signing/hooks/use-asset-transfer';
import { useSelectedAsset } from '@common/hooks/use-selected-asset';

interface TokenTransferParams {
  amount: number;
  recipient: string;
  memo: string;
}

export function useMakeStxTransfer() {
  return useAtomCallback<undefined | StacksTransaction, TokenTransferParams>(
    useCallback(async (get, _set, arg) => {
      const { amount, recipient, memo } = arg;
      const address = get(currentAccountStxAddressState);
      if (!address) return;
      const { network, account, nonce } = await get(
        waitForAll({
          network: currentStacksNetworkState,
          account: currentAccountState,
          nonce: correctNonceState(address),
        }),
        true
      );

      if (!account) return;

      return makeSTXTokenTransfer({
        recipient,
        amount: new BN(stxToMicroStx(amount).toString(), 10),
        memo,
        senderKey: account.stxPrivateKey,
        network,
        nonce: new BN(nonce.toString(), 10),
        anchorMode: AnchorMode.Any,
      });
    }, [])
  );
}

export function useMakeTransferEffect({
  isShowing,
  amount,
  recipient,
  memo,
  transaction,
  setTransaction,
  loadingKey,
}: {
  transaction: StacksTransaction | null;
  isShowing: boolean;
  amount: number;
  recipient: string;
  memo: string;
  setTransaction: (transaction: StacksTransaction) => void;
  loadingKey: string;
}) {
  const { isLoading, setIsLoading, setIsIdle } = useLoading(loadingKey);
  const { selectedAsset } = useSelectedAsset();
  const handleMakeStxTransaction = useMakeStxTransfer();
  const handleMakeFtTransaction = useMakeAssetTransfer();
  const isActive = isShowing && !!amount && !!recipient;
  const notLoaded = selectedAsset && !transaction && !isLoading;
  const method = selectedAsset?.type === 'stx' ? handleMakeStxTransaction : handleMakeFtTransaction;

  const handleGenerateTransfer = useCallback(async () => {
    setIsLoading();
    const tx = await method({
      amount,
      recipient,
      memo,
    });
    if (tx) setTransaction(tx);
    setIsIdle();
  }, [amount, recipient, memo, method, setTransaction, setIsLoading, setIsIdle]);

  useEffect(() => {
    if (isActive && notLoaded) void handleGenerateTransfer();
  }, [isActive, notLoaded, setIsLoading, handleGenerateTransfer]);
}
