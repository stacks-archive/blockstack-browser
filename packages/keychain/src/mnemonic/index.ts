import { generateMnemonic as generateBip39Mnemonic, mnemonicToSeed } from 'bip39';
import { randomBytes } from 'blockstack/lib/encryption/cryptoRandom';
import { bip32 } from 'bitcoinjs-lib';

import { encrypt } from '../encryption/encrypt';
import { encryptMnemonic } from 'blockstack';

export type AllowedKeyEntropyBits = 128 | 256;

export async function generateMnemonicRootKeychain(entropy: AllowedKeyEntropyBits) {
  const plaintextMnemonic = generateBip39Mnemonic(entropy, randomBytes);
  const seedBuffer = await mnemonicToSeed(plaintextMnemonic);
  const rootNode = bip32.fromSeed(seedBuffer);
  return {
    rootNode,
    plaintextMnemonic,
  };
}

export async function generateEncryptedMnemonicRootKeychain(
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

export async function deriveRootKeychainFromMnemonic(plaintextMnemonic: string) {
  const seedBuffer = await mnemonicToSeed(plaintextMnemonic);
  const rootNode = bip32.fromSeed(seedBuffer);
  return rootNode;
}

export async function encryptMnemonicFormatted(plaintextMnemonic: string, password: string) {
  const encryptedMnemonic = await encryptMnemonic(plaintextMnemonic, password);
  const encryptedMnemonicHex = encryptedMnemonic.toString('hex');
  return { encryptedMnemonic, encryptedMnemonicHex };
}
