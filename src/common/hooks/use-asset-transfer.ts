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
import { makeFungibleTokenTransferState } from '@store/recoil/transfers';

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
    if (!assetTransferState) return;
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

    const postConditionOptions = tokenBalanceKey
      ? {
          contractAddress,
          contractName,
          assetName,
          stxAddress,
          amount,
        }
      : undefined;

    const postConditions = postConditionOptions ? [makePostCondition(postConditionOptions)] : [];

    // (transfer (uint principal principal) (response bool uint))
    const functionArgs = [
      uintCV(amount),
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
