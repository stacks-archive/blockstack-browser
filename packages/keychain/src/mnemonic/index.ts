import { generateMnemonic as generateBip39Mnemonic, mnemonicToSeed } from 'bip39';
import { randomBytes } from 'blockstack/lib/encryption/cryptoRandom';
import { bip32 } from 'bitcoinjs-lib';

import { encrypt } from '../encryption/encrypt';

export type AllowedKeyEntropyBits = 128 | 256;

export async function generateMnemonicRootKeychain(
  password: string,
  entropy: AllowedKeyEntropyBits
) {
  const plaintextMnemonic = generateBip39Mnemonic(entropy, randomBytes);
  const seedBuffer = await mnemonicToSeed(plaintextMnemonic);
  const rootNode = bip32.fromSeed(seedBuffer);
  const ciphertextBuffer = await encrypt(plaintextMnemonic, password);
  const encryptedMnemonicPhrase = ciphertextBuffer.toString('hex');
  return {
    rootNode,
    encryptedMnemonicPhrase,
  };
}

export async function deriveRootKeychainFromMnemonic(plaintextMnemonic: string, password: string) {
  const encryptedMnemonic = await encrypt(plaintextMnemonic, password);
  const encryptedMnemonicHex = encryptedMnemonic.toString('hex');
  const seedBuffer = await mnemonicToSeed(plaintextMnemonic);
  const rootNode = bip32.fromSeed(seedBuffer);
  return {
    rootNode,
    encryptedMnemonic,
    encryptedMnemonicHex,
  };
}
