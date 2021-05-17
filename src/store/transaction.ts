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
import {
  ContractCallPayload,
  ContractDeployPayload,
  STXTransferPayload,
  TransactionPayload,
  TransactionTypes,
} from '@stacks/connect';
import { decodeToken } from 'jsontokens';
import { atom, selector, selectorFamily } from 'recoil';
import { generateTransaction } from '@common/transaction-utils';
import { currentAccountStore, currentAccountStxAddressStore } from '@store/wallet';
import { currentNetworkStore, rpcClientStore, stacksNetworkStore } from '@store/networks';
import { accountBalancesStore, correctNonceState } from './api';
import { selectedAssetStore } from './asset-search';
import BN from 'bn.js';
import { stxToMicroStx } from '@common/stacks-utils';
import { getAssetStringParts } from '@stacks/ui-utils';

export type TransactionPayloadWithAttachment = TransactionPayload & {
  attachment?: string;
};

/** Transaction signing popup store */

export const showTxDetails = atom<boolean>({
  key: 'transaction.show-details',
  default: true,
});

export const requestTokenStore = atom<string | null>({
  key: 'transaction.request-token',
  default: null,
});

function getPayload(requestToken: string) {
  if (!requestToken) return undefined;
  const token = decodeToken(requestToken);
  const payload = token.payload as unknown as TransactionPayloadWithAttachment;

  if (payload.txType === TransactionTypes.ContractCall)
    return payload as ContractCallPayload & {
      attachment?: string;
    };
  if (payload.txType === TransactionTypes.ContractDeploy)
    return payload as ContractDeployPayload & {
      attachment?: string;
    };
  if (payload.txType === TransactionTypes.STXTransfer)
    return payload as STXTransferPayload & {
      attachment?: string;
    };
  return payload;
}

export const transactionPayloadStore = selector({
  key: 'transaction.payload',
  get: ({ get }) => {
    const requestToken = get(requestTokenStore);
    if (requestToken === null) return;
    return getPayload(requestToken);
  },
});

export const pendingTransactionStore = selector({
  key: 'transaction.pending-transaction',
  get: ({ get }) => {
    const requestToken = get(requestTokenStore);
    if (!requestToken) return undefined;
    const tx = getPayload(requestToken);
    if (!tx) return undefined;
    const network = get(stacksNetworkStore);
    const postConditions = get(postConditionsStore);
    tx.postConditions = postConditions;
    tx.network = network;
    return tx;
  },
});

export const contractSourceStore = selector({
  key: 'transaction.contract-source',
  get: async ({ get }) => {
    const tx = get(pendingTransactionStore);
    const rpcClient = get(rpcClientStore);

    if (!tx) return '';

    if (tx.txType === TransactionTypes.ContractCall)
      return rpcClient.fetchContractSource({
        contractName: tx.contractName,
        contractAddress: tx.contractAddress,
      });

    if (tx.txType === TransactionTypes.ContractDeploy) return tx.codeBody;

    return '';
  },
});

export const contractInterfaceStore = selector({
  key: 'transaction.contract-interface',
  get: async ({ get }) => {
    const payload = get(transactionPayloadStore);
    const tx = get(pendingTransactionStore);
    const network = get(currentNetworkStore);
    const rpcClient = get(rpcClientStore);
    if (!tx) {
      return undefined;
    }
    if (payload?.network && payload.network.chainId !== network.chainId) return undefined;
    if (tx.txType === TransactionTypes.ContractCall) {
      try {
        // TODO: replace with smartContract client from api client
        return rpcClient.fetchContractInterface({
          contractName: tx.contractName,
          contractAddress: tx.contractAddress,
        });
      } catch (error) {
        // TODO: fix race condition
        // we don't need to throw here
        // the network switch can happen before or after this,
        // and the interface can sometimes fail before landing on the correct network
        // @see https://github.com/blockstack/stacks-wallet-web/issues/1174
        console.log(
          `Unable to fetch interface for contract ${tx.contractAddress}.${tx.contractName}`
        );
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
      console.error('Unable to sign transaction when logged out.');
      return undefined;
    }
    const pendingTransaction = get(pendingTransactionStore);
    if (!pendingTransaction) {
      console.error('Unable to get signed transaction - no pending transaction found.');
      return undefined;
    }
    const nonce = get(correctNonceState);
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

export const postConditionsHasSetStore = atom<boolean>({
  key: 'transaction.postConditions.hasSet',
  default: false,
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
  get:
    ([amount, recipient, nonce]: [number, string, number]) =>
    async ({ get }) => {
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
          const {
            address: contractAddress,
            contractName,
            assetName,
          } = getAssetStringParts(asset.contractAddress);
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
            functionArgs: [
              standardPrincipalCVFromAddress(createAddress(recipient)),
              uintCV(amount),
            ],
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

export const isUnauthorizedTransactionStore = atom<boolean>({
  key: 'transaction.is-unauthorized-tx',
  default: false,
});
