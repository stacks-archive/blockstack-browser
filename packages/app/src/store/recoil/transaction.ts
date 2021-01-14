import { PostCondition } from '@stacks/transactions';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import { decodeToken } from 'jsontokens';
import { atom, selector } from 'recoil';
import { generateTransaction } from '@common/transaction-utils';
import { currentAccountStore } from '@store/recoil/wallet';
import { rpcClientStore, stacksNetworkStore } from '@store/recoil/networks';
import { correctNonceStore } from './api';

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
    const pendingTransaction = get(pendingTransactionStore);
    const nonce = get(correctNonceStore);
    if (!account) {
      throw new Error('Unable to sign transaction when logged out.');
    }
    if (!pendingTransaction) {
      throw new Error('Unable to get signed transaction - no pending transaction found.');
    }
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
