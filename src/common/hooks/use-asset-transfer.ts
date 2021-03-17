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

function makePostConditions(options?: PostConditionsOptions) {
  if (!options) return [];

  const { contractAddress, contractName, assetName, stxAddress, amount } = options;
  const postConditions: PostCondition[] = [];

  const assetInfo = createAssetInfo(contractAddress, contractName, assetName);
  const pc = makeStandardFungiblePostCondition(
    stxAddress,
    FungibleConditionCode.Equal,
    new BN(amount, 10),
    assetInfo
  );
  postConditions.push(pc);

  return postConditions;
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

    const postConditions = makePostConditions(postConditionOptions);

    const functionArgs = [standardPrincipalCVFromAddress(createAddress(recipient)), uintCV(amount)];

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
