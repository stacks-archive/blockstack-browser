import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { bip32, BIP32Interface } from 'bitcoinjs-lib'
import { randomBytes } from 'blockstack/lib/encryption/cryptoRandom'

import { getBlockchainIdentities, IdentityKeyPair } from './utils'
import { encrypt} from './encryption/encrypt'
import Identity from './identity'

export interface ConstructorOptions {
  identityPublicKeychain: string
  bitcoinPublicKeychain: string
  firstBitcoinAddress: string
  identityKeypairs: IdentityKeyPair[]
  identityAddresses: string[]
  encryptedBackupPhrase: string
  identities: Identity[]
}

export class Wallet {
  encryptedBackupPhrase: string
  bitcoinPublicKeychain: string
  firstBitcoinAddress: string
  identityKeypairs: IdentityKeyPair[]
  identityAddresses: string[]
  identityPublicKeychain: string
  identities: Identity[]

  constructor({
    encryptedBackupPhrase,
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityKeypairs,
    identityAddresses,
    identities
  }: ConstructorOptions) {
    this.encryptedBackupPhrase = encryptedBackupPhrase
    this.identityPublicKeychain = identityPublicKeychain
    this.bitcoinPublicKeychain = bitcoinPublicKeychain
    this.firstBitcoinAddress = firstBitcoinAddress
    this.identityKeypairs = identityKeypairs
    this.identityAddresses = identityAddresses
    this.identities = identities.map((identity) => new Identity(identity))
  }

  static async generate(password: string) {
    const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
    const backupPhrase = generateMnemonic(STRENGTH, randomBytes)
    const seedBuffer = await mnemonicToSeed(backupPhrase)
    const masterKeychain = bip32.fromSeed(seedBuffer)
    const ciphertextBuffer = await encrypt(backupPhrase, password)
    const encryptedBackupPhrase = ciphertextBuffer.toString('hex')
    return this.createAccount(encryptedBackupPhrase, masterKeychain)
  }

  static async restore(password: string, backupPhrase: string) {
    const encryptedMnemonic = await encrypt(backupPhrase, password)
    const encryptedMnemonicHex = encryptedMnemonic.toString('hex')
    const seedBuffer = await mnemonicToSeed(backupPhrase)
    const rootNode = bip32.fromSeed(seedBuffer)
    return this.createAccount(encryptedMnemonicHex, rootNode)
  }

  static async createAccount(encryptedBackupPhrase: string, masterKeychain: BIP32Interface, identitiesToGenerate = 1) {
    const walletAttrs = await getBlockchainIdentities(masterKeychain, identitiesToGenerate)
    return new this({
      ...walletAttrs,
      encryptedBackupPhrase
    })
  }
}

export default Wallet
