import { generateMnemonic, mnemonicToSeed } from 'bip39'
import { bip32, BIP32Interface } from 'bitcoinjs-lib'
import { randomBytes } from 'blockstack/lib/encryption/cryptoRandom'

import { getBlockchainIdentities, IdentityKeyPair, makeIdentity, assertIsTruthy } from '../utils'
import { encrypt} from '../encryption/encrypt'
import Identity from '../identity'
import { decrypt } from '../encryption/decrypt'
import { connectToGaiaHub, encryptContent, getPublicKeyFromPrivate, decryptContent } from 'blockstack'
import { GaiaHubConfig, uploadToGaiaHub } from 'blockstack/lib/storage/hub'

const CONFIG_INDEX = 45

export interface ConfigApp {
  origin: string
  scopes: string[]
  lastLoginAt: number
  appIcon: string
  name: string
}

interface ConfigIdentity {
  username?: string
  address: string
  apps: {
    [origin: string]: ConfigApp
  }
}

export interface WalletConfig {
  identities: ConfigIdentity[]
  hideWarningForReusingIdentity?: boolean
}

export interface ConstructorOptions {
  identityPublicKeychain: string
  bitcoinPublicKeychain: string
  firstBitcoinAddress: string
  identityKeypairs: IdentityKeyPair[]
  identityAddresses: string[]
  encryptedBackupPhrase: string
  identities: Identity[]
  configPrivateKey: string
  walletConfig?: WalletConfig
}

export class Wallet {
  encryptedBackupPhrase: string
  bitcoinPublicKeychain: string
  firstBitcoinAddress: string
  identityKeypairs: IdentityKeyPair[]
  identityAddresses: string[]
  identityPublicKeychain: string
  identities: Identity[]
  configPrivateKey: string
  walletConfig?: WalletConfig

  constructor({
    encryptedBackupPhrase,
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityKeypairs,
    identityAddresses,
    identities,
    configPrivateKey,
    walletConfig
  }: ConstructorOptions) {
    this.encryptedBackupPhrase = encryptedBackupPhrase
    this.identityPublicKeychain = identityPublicKeychain
    this.bitcoinPublicKeychain = bitcoinPublicKeychain
    this.firstBitcoinAddress = firstBitcoinAddress
    this.identityKeypairs = identityKeypairs
    this.identityAddresses = identityAddresses
    this.identities = identities.map((identity) => new Identity(identity))
    this.configPrivateKey = configPrivateKey
    this.walletConfig = walletConfig
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
    const configPrivateKey = masterKeychain.deriveHardened(CONFIG_INDEX).privateKey?.toString('hex') as string
    const walletAttrs = await getBlockchainIdentities(masterKeychain, identitiesToGenerate)
    return new this({
      ...walletAttrs,
      configPrivateKey,
      encryptedBackupPhrase
    })
  }

  async createNewIdentity(password: string) {
    const plainTextBuffer = await decrypt(Buffer.from(this.encryptedBackupPhrase, 'hex'), password)
    const seed = await mnemonicToSeed(plainTextBuffer)
    const rootNode = bip32.fromSeed(seed)
    const index = this.identities.length
    const identity = await makeIdentity(rootNode, index)
    this.identities.push(identity)
    this.identityKeypairs.push(identity.keyPair)
    this.identityAddresses.push(identity.address)
    return identity
  }

  async createGaiaConfig(gaiaHubUrl: string) {
    return connectToGaiaHub(gaiaHubUrl, this.configPrivateKey)
  }

  async fetchConfig(gaiaConfig: GaiaHubConfig): Promise<WalletConfig | null> {
    try {
      const response = await fetch(`${gaiaConfig.url_prefix}/${gaiaConfig.address}/wallet-config.json`)
      const encrypted = await response.text()
      const configJSON = await decryptContent(encrypted, { privateKey: this.configPrivateKey }) as string
      const config: WalletConfig = JSON.parse(configJSON)
      this.walletConfig = config
      return config
    } catch (error) {
      // console.error(error)
      return null
    }
  }

  async getOrCreateConfig(gaiaConfig: GaiaHubConfig): Promise<WalletConfig> {
    if (this.walletConfig) {
      return this.walletConfig
    }
    const config = await this.fetchConfig(gaiaConfig)
    if (config) {
      return config
    }
    const newConfig: WalletConfig = {
      identities: this.identities.map(i => ({
        username: i.defaultUsername,
        address: i.address,
        apps: {}
      }))
    }
    this.walletConfig = newConfig
    await this.updateConfig(gaiaConfig)
    return newConfig
  }

  async updateConfig(gaiaConfig: GaiaHubConfig): Promise<void> {
    const publicKey = getPublicKeyFromPrivate(this.configPrivateKey)
    const encrypted =  await encryptContent(JSON.stringify(this.walletConfig), { publicKey })
    await uploadToGaiaHub('wallet-config.json', encrypted, gaiaConfig, 'application/json')
  }

  async updateConfigWithAuth({ identityIndex, app, gaiaConfig }: 
  { 
    identityIndex: number
    app: ConfigApp
    gaiaConfig: GaiaHubConfig 
  }) {
    assertIsTruthy<WalletConfig>(this.walletConfig)

    this.identities.forEach((identity, index) => {
      if (!this.walletConfig?.identities[index]) {
        this.walletConfig?.identities.push({
          username: identity.defaultUsername,
          address: identity.address,
          apps: {}
        })
      }
    })

    const identity = this.walletConfig.identities[identityIndex]
    identity.apps[app.origin] = app
    this.walletConfig.identities[identityIndex] = identity
    console.log('updating config')
    await this.updateConfig(gaiaConfig)
  }

  async updateConfigForReuseWarning({ gaiaConfig }: { gaiaConfig: GaiaHubConfig; }) {
    assertIsTruthy<WalletConfig>(this.walletConfig)

    this.walletConfig.hideWarningForReusingIdentity = true

    await this.updateConfig(gaiaConfig)
  }
}

export default Wallet
