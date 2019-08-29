import { generateMnemonic, mnemonicToSeed, validateMnemonic } from 'bip39'
import { fromSeed, BIP32Interface } from 'bip32'
import { randomBytes } from 'crypto'

import { encrypt, getBlockchainIdentities, IdentityKeyPair } from './utils'
import HDNode from './hdnode'

interface ConstructorOptions {
  identityPublicKeychain: string
  bitcoinPublicKeychain: string
  firstBitcoinAddress: string
  identityKeypairs: IdentityKeyPair[]
  identityAddresses: string[]
  encryptedBackupPhrase: string
}

export default class Wallet {
  encryptedBackupPhrase: string
  bitcoinPublicKeyChain: string
  firstBitcoinAddress: string
  identityKeypairs: IdentityKeyPair[]
  identityAddresses: string[]
  identityPublicKeychain: string

  constructor({
    encryptedBackupPhrase,
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityKeypairs,
    identityAddresses,
  }: ConstructorOptions) {
    this.encryptedBackupPhrase = encryptedBackupPhrase
    this.identityPublicKeychain = identityPublicKeychain
    this.bitcoinPublicKeyChain = bitcoinPublicKeychain
    this.firstBitcoinAddress = firstBitcoinAddress
    this.identityKeypairs = identityKeypairs
    this.identityAddresses = identityAddresses
  }

  static async generate(password: string) {
    const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
    const backupPhrase = generateMnemonic(STRENGTH, randomBytes)
    const seedBuffer = await mnemonicToSeed(backupPhrase)
    const masterKeychain = fromSeed(seedBuffer)
    const ciphertextBuffer = await encrypt(new Buffer(backupPhrase), password)
    const encryptedBackupPhrase = ciphertextBuffer.toString()
    return this.createAccount(encryptedBackupPhrase, masterKeychain)
  }

  static async restore(password: string, backupPhrase: string) {
    if (!validateMnemonic(backupPhrase)) {
      throw new Error('Invalid mnemonic used to restore wallet')
    }
    const seedBuffer = await mnemonicToSeed(backupPhrase)
    const masterKeychain = fromSeed(seedBuffer)
    const ciphertextBuffer = await encrypt(new Buffer(backupPhrase), password)
    const encryptedBackupPhrase = ciphertextBuffer.toString()
    return this.createAccount(encryptedBackupPhrase, masterKeychain)
  }

  static createAccount(encryptedBackupPhrase: string, masterKeychain: BIP32Interface, identitiesToGenerate = 1) {
    const walletAttrs = getBlockchainIdentities(masterKeychain, identitiesToGenerate)
    return new this({
      ...walletAttrs,
      encryptedBackupPhrase
    })
  }
}
