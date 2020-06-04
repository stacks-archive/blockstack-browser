import { ChainID, getAddressFromPrivateKey } from '@blockstack/stacks-transactions';
import { BIP32Interface, ECPair } from 'bitcoinjs-lib';
import { ecPairToHexString } from 'blockstack';

export const derivationPaths = {
  [ChainID.Mainnet]: `m/44'/5757'/0'/0/0`,
  [ChainID.Testnet]: `m/44'/1'/0'/0/0`,
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
    return {
      childKey,
      address: getAddressFromPrivateKey(privateKey),
      privateKey,
    };
  };
}
