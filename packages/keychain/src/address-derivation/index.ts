import {
  ChainID,
  getAddressFromPrivateKey,
  TransactionVersion,
} from '@blockstack/stacks-transactions';
import { BIP32Interface, ECPair } from 'bitcoinjs-lib';
import { ecPairToHexString } from 'blockstack';

const networkDerivationPath = `m/44'/5757'/0'/0/0`;

export const derivationPaths = {
  [ChainID.Mainnet]: networkDerivationPath,
  [ChainID.Testnet]: networkDerivationPath,
};

export function getDerivationPath(chain: ChainID) {
  return derivationPaths[chain];
}

export function deriveStxAddressChain(chain: ChainID) {
  return (rootNode: BIP32Interface) => {
    const childKey = rootNode.derivePath(getDerivationPath(chain));
    if (!childKey.privateKey) {
      throw new Error('Unable to derive private key from `rootNode`, bip32 master keychain');
    }
    const ecPair = ECPair.fromPrivateKey(childKey.privateKey);
    const privateKey = ecPairToHexString(ecPair);
    const txVersion =
      chain === ChainID.Mainnet ? TransactionVersion.Mainnet : TransactionVersion.Testnet;
    return {
      childKey,
      address: getAddressFromPrivateKey(privateKey, txVersion),
      privateKey,
    };
  };
}
