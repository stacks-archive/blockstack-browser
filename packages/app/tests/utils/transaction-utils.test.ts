import '../setup';
import { generateTransaction } from '../../src/common/transaction-utils';
import { Wallet } from '@stacks/keychain';
import {
  ChainID,
  PostConditionMode,
  makeStandardFungiblePostCondition,
  FungibleConditionCode,
  createAssetInfo,
} from '@blockstack/stacks-transactions';
import { makeContractCallToken, TransactionPayload } from '../../../connect/src/index';
import BN from 'bn.js';
import { decodeToken } from 'blockstack';

describe('generated transactions', () => {
  test('can handle encoded payload', async () => {
    const defaultSeed =
      'sound idle panel often situate develop unit text design antenna ' +
      'vendor screen opinion balcony share trigger accuse scatter visa uniform brass ' +
      'update opinion media';
    const wallet = await Wallet.restore('password', defaultSeed, ChainID.Mainnet);
    const address = 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH';
    const assetAddress = 'ST34RKEJKQES7MXQFBT29KSJZD73QK3YNT5N56C6X';
    const assetContractName = 'test-asset-contract';
    const assetName = 'test-asset-name';
    const info = createAssetInfo(assetAddress, assetContractName, assetName);
    localStorage.setItem(
      'blockstack-session',
      JSON.stringify({
        userData: {
          appPrivateKey: 'e494f188c2d35887531ba474c433b1e41fadd8eb824aca983447fd4bb8b277a801',
        },
        version: '1.0.0',
      })
    );
    const txDataToken = await makeContractCallToken({
      contractAddress: 'ST1EXHZSN8MJSJ9DSG994G1V8CNKYXGMK7Z4SA6DH',
      contractName: 'hello-world',
      functionArgs: [],
      functionName: 'print',
      postConditionMode: PostConditionMode.Allow,
      postConditions: [
        makeStandardFungiblePostCondition(
          address,
          FungibleConditionCode.GreaterEqual,
          new BN(100),
          info
        ),
      ],
    });
    const token = decodeToken(txDataToken);
    const txData = (token.payload as unknown) as TransactionPayload;
    const tx = await generateTransaction({ txData, wallet, nonce: 1 });
    expect(tx.postConditionMode).toEqual(PostConditionMode.Allow);
    const postCondition = tx.postConditions.values[0];
    if ('amount' in postCondition) {
      expect(postCondition.amount.toNumber()).toEqual(100);
    } else {
      throw new Error('Deserialized TX does not have post condition');
    }
  }, 20000);
});
