import {
  createAddress,
  createAssetInfo,
  FungibleConditionCode,
  makeContractCall,
  makeStandardFungiblePostCondition,
  makeSTXTokenTransfer,
  PostCondition,
  standardPrincipalCVFromAddress,
  uintCV,
} from '@stacks/transactions';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import { decodeToken } from 'jsontokens';
import { atom, selector, selectorFamily } from 'recoil';
import { generateTransaction } from '@common/transaction-utils';
import { currentAccountStore, currentAccountStxAddressStore } from '@store/recoil/wallet';
import { rpcClientStore, stacksNetworkStore } from '@store/recoil/networks';
import { accountBalancesStore, correctNonceStore } from './api';
import { selectedAssetStore } from './asset-search';
import BN from 'bn.js';
import { stxToMicroStx } from '@common/stacks-utils';
import { getAssetStringParts } from '@stacks/ui-utils';

/** Transaction signing popup store */

export const showTxDetails = atom<boolean>({
  key: 'transaction.show-details',
  default: true,
});

export const requestTokenStore = atom<string>({
  key: 'transaction.request-token',
  default: '',
  effects_UNSTABLE: [
    ({ setSelf, trigger }) => {
      if (trigger === 'get') {
        const search = location.hash.split('/transaction')[1];
        const urlParams = new URLSearchParams(search);
        const requestToken = urlParams.get('request');
        if (requestToken) {
          setSelf(requestToken);
        }
      }
    },
  ],
});

const getPayload = (requestToken: string) => {
  if (!requestToken) return undefined;
  const token = decodeToken(requestToken);
  const tx = (token.payload as unknown) as TransactionPayload;
  return tx;
};

export const transactionPayloadStore = selector({
  key: 'transaction.payload',
  get: ({ get }) => {
    const requestToken = get(requestTokenStore);
    return getPayload(requestToken);
  },
});

export const pendingTransactionStore = selector({
  key: 'transaction.pending-transaction',
  get: ({ get }) => {
    const requestToken = get(requestTokenStore);
    const tx = getPayload(requestToken);
    if (!tx) return undefined;
    const stacksNetwork = get(stacksNetworkStore);
    const postConditions = get(postConditionsStore);
    tx.postConditions = [...postConditions];
    tx.network = stacksNetwork;
    return tx;
  },
});

export const contractSourceStore = selector({
  key: 'transaction.contract-source',
  get: async ({ get }) => {
    const tx = get(pendingTransactionStore);
    const rpcClient = get(rpcClientStore);
    if (!tx) {
      return '';
    }
    if (tx.txType === TransactionTypes.ContractCall) {
      const source = await rpcClient.fetchContractSource({
        contractName: tx.contractName,
        contractAddress: tx.contractAddress,
      });
      return source;
    } else if (tx.txType === TransactionTypes.ContractDeploy) {
      return tx.codeBody;
    }
    return '';
  },
});

export const contractInterfaceStore = selector({
  key: 'transaction.contract-interface',
  get: async ({ get }) => {
    const tx = get(pendingTransactionStore);
    const rpcClient = get(rpcClientStore);
    if (!tx) {
      return undefined;
    }
    if (tx.txType === TransactionTypes.ContractCall) {
      try {
        const abi = await rpcClient.fetchContractInterface({
          contractName: tx.contractName,
          contractAddress: tx.contractAddress,
        });
        return abi;
      } catch (error) {
        throw `Unable to fetch interface for contract ${tx.contractAddress}.${tx.contractName}`;
      }
    }
    return undefined;
  },
});

export const pendingTransactionFunctionSelector = selector({
  key: 'transactions.pending-transaction-function',
  get: ({ get }) => {
    const pendingTransaction = get(pendingTransactionStore);
    const contractInterface = get(contractInterfaceStore);
    if (
      !pendingTransaction ||
      pendingTransaction.txType !== 'contract_call' ||
      !contractInterface
    ) {
      return undefined;
    }
    const selectedFunction = contractInterface.functions.find(func => {
      return func.name === pendingTransaction.functionName;
    });
    if (!selectedFunction) {
      throw new Error(
        `Attempting to call a function (\`${pendingTransaction.functionName}\`) that ` +
          `does not exist on contract ${pendingTransaction.contractAddress}.${pendingTransaction.contractName}`
      );
    }
    return selectedFunction;
  },
});

export const signedTransactionStore = selector({
  key: 'transaction.signedTransaction',
  get: async ({ get }) => {
    const account = get(currentAccountStore);
    if (!account) {
      throw new Error('Unable to sign transaction when logged out.');
    }
    const pendingTransaction = get(pendingTransactionStore);
    if (!pendingTransaction) {
      throw new Error('Unable to get signed transaction - no pending transaction found.');
    }
    const nonce = get(correctNonceStore);
    const tx = await generateTransaction({
      senderKey: account.stxPrivateKey,
      nonce,
      txData: pendingTransaction,
    });
    return tx;
  },
  dangerouslyAllowMutability: true,
});

export const postConditionsStore = atom<PostCondition[]>({
  key: 'transaction.postConditions',
  default: [],
});

export const currentPostConditionIndexStore = atom<number | undefined>({
  key: 'transaction.currentPostConditionIndex',
  default: undefined,
});

export const currentPostConditionStore = selector<PostCondition | undefined>({
  key: 'transaction.currentPostCondition',
  get: ({ get }) => {
    const index = get(currentPostConditionIndexStore);
    if (index === undefined) {
      return undefined;
    }
    const postConditions = get(postConditionsStore);
    return postConditions[index];
  },
});

export const transactionBroadcastErrorStore = atom<string | null>({
  key: 'transaction.broadcast-error',
  default: null,
});

// A recoil selector used for creating internal transactions
export const internalTransactionStore = selectorFamily({
  key: 'transaction.internal-transaction',
  get: ([amount, recipient, nonce]: [number, string, number]) => async ({ get }) => {
    try {
      const asset = get(selectedAssetStore);
      const currentAccount = get(currentAccountStore);
      const currentAccountStxAddress = get(currentAccountStxAddressStore);
      if (!asset || !currentAccount || !currentAccountStxAddress) return null;
      const network = get(stacksNetworkStore);
      const balances = get(accountBalancesStore);
      if (asset.type === 'stx') {
        const mStx = stxToMicroStx(amount);
        try {
          const _tx = await makeSTXTokenTransfer({
            recipient,
            amount: new BN(mStx.toString(), 10),
            senderKey: currentAccount.stxPrivateKey,
            network,
            nonce: new BN(nonce, 10),
          });
          return _tx;
        } catch (e) {
          console.error('makeSTXTokenTransfer failed', e.message);
          return null;
        }
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
          nonce: new BN(nonce, 10),
        });
        return _tx;
      }
    } catch (e) {
      console.error('internalTransactionStore failed', e);
      return null;
    }
  },
});
