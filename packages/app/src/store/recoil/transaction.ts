import {
  TransactionVersion,
  StacksMainnet,
  StacksTestnet,
  PostCondition,
} from '@blockstack/stacks-transactions';
import { TransactionPayload, TransactionTypes } from '@stacks/connect';
import { decodeToken } from 'blockstack';
import { atom, selector } from 'recoil';
import { WalletSigner } from '@stacks/keychain';
import { generateTransaction } from '@common/transaction-utils';
import { currentIdentityStore } from '@store/recoil/wallet';
import { rpcClientStore, currentNetworkStore } from '@store/recoil/networks';
import { correctNonceStore } from './api';

/** Transaction signing popup */

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

export const pendingTransactionStore = selector({
  key: 'transaction.pending-transaction',
  get: ({ get }) => {
    const requestToken = get(requestTokenStore);
    if (!requestToken) return undefined;
    const token = decodeToken(requestToken);
    const currentNetwork = get(currentNetworkStore);
    const tx = (token.payload as unknown) as TransactionPayload;
    const postConditions = get(postConditionsStore);
    tx.postConditions = [...postConditions];
    const network =
      tx.network?.version === TransactionVersion.Mainnet
        ? new StacksMainnet()
        : new StacksTestnet();
    network.coreApiUrl = currentNetwork.url;
    tx.network = network;
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
    const currentIdentity = get(currentIdentityStore);
    const pendingTransaction = get(pendingTransactionStore);
    const nonce = get(correctNonceStore);
    if (!currentIdentity) {
      throw new Error('Unable to sign transaction when logged out.');
    }
    if (!pendingTransaction) {
      throw new Error('Unable to get signed transaction - no pending transaction found.');
    }
    const signer = new WalletSigner({ privateKey: currentIdentity.keyPair.key });
    const tx = await generateTransaction({
      signer,
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
