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
import { TransactionPayload } from '@stacks/connect';
import { atom, selectorFamily } from 'recoil';
import {
  accountBalancesState,
  currentAccountState,
  currentAccountStxAddressState,
} from '@store/accounts';
import { stacksNetworkStore } from '@store/networks';
import { selectedAssetStore } from './assets/asset-search';
import BN from 'bn.js';
import { stxToMicroStx } from '@common/stacks-utils';
import { getAssetStringParts } from '@stacks/ui-utils';

export type TransactionPayloadWithAttachment = TransactionPayload & {
  attachment?: string;
};

export const isUnauthorizedTransactionState = atom<boolean>({
  key: 'transaction.is-unauthorized-tx',
  default: false,
});

export const transactionBroadcastErrorState = atom<string | null>({
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
        const currentAccount = get(currentAccountState);
        const currentAccountStxAddress = get(currentAccountStxAddressState);
        if (!asset || !currentAccount || !currentAccountStxAddress) return null;
        const network = get(stacksNetworkStore);
        const balances = get(accountBalancesState);
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
