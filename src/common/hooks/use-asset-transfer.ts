import {
  createAddress,
  createAssetInfo,
  FungibleConditionCode,
  makeContractCall,
  makeStandardFungiblePostCondition,
  PostCondition,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';
import BN from 'bn.js';
import { useRecoilCallback } from 'recoil';
import { makeFungibleTokenTransferState } from '@store/transfers';
import { selectedAssetStore } from '@store/asset-search';
import { ftUnshiftDecimals } from '@common/stacks-utils';

interface PostConditionsOptions {
  contractAddress: string;
  contractName: string;
  assetName: string;
  stxAddress: string;
  amount: number;
}

function makePostCondition(options: PostConditionsOptions): PostCondition {
  const { contractAddress, contractName, assetName, stxAddress, amount } = options;

  const assetInfo = createAssetInfo(contractAddress, contractName, assetName);
  return makeStandardFungiblePostCondition(
    stxAddress,
    FungibleConditionCode.Equal,
    new BN(amount, 10),
    assetInfo
  );
}

export function useMakeAssetTransfer() {
  return useRecoilCallback(({ snapshot }) => async ({ amount, recipient }) => {
    const assetTransferState = await snapshot.getPromise(makeFungibleTokenTransferState);
    const selectedAsset = await snapshot.getPromise(selectedAssetStore);
    if (!assetTransferState || !selectedAsset) return;
    const {
      balances,
      network,
      senderKey,
      assetName,
      contractAddress,
      contractName,
      nonce,
      stxAddress,
    } = assetTransferState;

    const functionName = 'transfer';

    const tokenBalanceKey = Object.keys(balances?.fungible_tokens || {}).find(contract => {
      return contract.startsWith(contractAddress);
    });

    const realAmount =
      selectedAsset.type === 'ft'
        ? ftUnshiftDecimals(amount, selectedAsset?.meta?.decimals || 0)
        : amount;

    const postConditionOptions = tokenBalanceKey
      ? {
          contractAddress,
          contractName,
          assetName,
          stxAddress,
          amount: realAmount,
        }
      : undefined;

    const postConditions = postConditionOptions ? [makePostCondition(postConditionOptions)] : [];

    // (transfer (uint principal principal) (response bool uint))
    const functionArgs = [
      uintCV(realAmount),
      standardPrincipalCVFromAddress(createAddress(stxAddress)),
      standardPrincipalCVFromAddress(createAddress(recipient)),
    ];

    const txOptions = {
      network,
      functionName,
      functionArgs,
      senderKey,
      contractAddress,
      contractName,
      postConditions,
      nonce: new BN(nonce, 10),
    };

    return makeContractCall(txOptions);
  });
}
