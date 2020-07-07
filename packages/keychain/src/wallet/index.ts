import { mnemonicToSeed } from 'bip39';
import { bip32, BIP32Interface } from 'bitcoinjs-lib';
import { ChainID } from '@blockstack/stacks-transactions';

import {
  getBlockchainIdentities,
  IdentityKeyPair,
  makeIdentity,
  assertIsTruthy,
  recursiveRestoreIdentities,
} from '../utils';
import Identity from '../identity';
import { decrypt } from '../encryption/decrypt';
import {
  connectToGaiaHub,
  encryptContent,
  getPublicKeyFromPrivate,
  decryptContent,
} from 'blockstack';
import { GaiaHubConfig, uploadToGaiaHub } from 'blockstack/lib/storage/hub';
import { makeReadOnlyGaiaConfig, DEFAULT_GAIA_HUB } from '../utils/gaia';
import {
  AllowedKeyEntropyBits,
  generateEncryptedMnemonicRootKeychain,
  deriveRootKeychainFromMnemonic,
  encryptMnemonicFormatted,
} from '../mnemonic';
import { deriveStxAddressChain } from '../address-derivation';

const CONFIG_INDEX = 45;

export interface ConfigApp {
  origin: string;
  scopes: string[];
  lastLoginAt: number;
  appIcon: string;
  name: string;
}

interface ConfigIdentity {
  username?: string;
  address: string;
  apps: {
    [origin: string]: ConfigApp;
  };
}

export interface WalletConfig {
  identities: ConfigIdentity[];
  hideWarningForReusingIdentity?: boolean;
}

export interface ConstructorOptions {
  chain: ChainID;
  identityPublicKeychain: string;
  bitcoinPublicKeychain: string;
  firstBitcoinAddress: string;
  identityKeypairs: IdentityKeyPair[];
  identityAddresses: string[];
  encryptedBackupPhrase: string;
  identities: Identity[];
  configPrivateKey: string;
  stxAddressKeychain: BIP32Interface;
  walletConfig?: WalletConfig;
}

export class Wallet {
  chain: ChainID;
  encryptedBackupPhrase: string;
  bitcoinPublicKeychain: string;
  firstBitcoinAddress: string;
  identityKeypairs: IdentityKeyPair[];
  identityAddresses: string[];
  identityPublicKeychain: string;
  identities: Identity[];
  configPrivateKey: string;
  stxAddressKeychain: BIP32Interface;
  walletConfig?: WalletConfig;

  constructor({
    chain,
    encryptedBackupPhrase,
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityKeypairs,
    identityAddresses,
    identities,
    configPrivateKey,
    stxAddressKeychain,
    walletConfig,
  }: ConstructorOptions) {
    this.chain = chain;
    this.encryptedBackupPhrase = encryptedBackupPhrase;
    this.identityPublicKeychain = identityPublicKeychain;
    this.bitcoinPublicKeychain = bitcoinPublicKeychain;
    this.firstBitcoinAddress = firstBitcoinAddress;
    this.identityKeypairs = identityKeypairs;
    this.identityAddresses = identityAddresses;
    this.identities = identities.map(identity => new Identity(identity));
    this.configPrivateKey = configPrivateKey;
    this.stxAddressKeychain = stxAddressKeychain;
    this.walletConfig = walletConfig;
  }

  static generateFactory(bitsEntropy: AllowedKeyEntropyBits) {
    return async (password: string, chain: ChainID) => {
      const { rootNode, encryptedMnemonicPhrase } = await generateEncryptedMnemonicRootKeychain(
        password,
        bitsEntropy
      );
      return this.createAccount({
        encryptedBackupPhrase: encryptedMnemonicPhrase,
        rootNode,
        chain,
      });
    };
  }

  static async generate(password: string, chain: ChainID) {
    return await this.generateFactory(128)(password, chain);
  }

  static async generateStrong(password: string, chain: ChainID) {
    return await this.generateFactory(256)(password, chain);
  }

  static async restore(password: string, seedPhrase: string, chain: ChainID) {
    const rootNode = await deriveRootKeychainFromMnemonic(seedPhrase);
    const { encryptedMnemonicHex } = await encryptMnemonicFormatted(seedPhrase, password);

    const wallet = await Wallet.createAccount({
      encryptedBackupPhrase: encryptedMnemonicHex,
      rootNode,
      chain,
    });

    return await wallet.restoreIdentities({ rootNode, gaiaReadURL: DEFAULT_GAIA_HUB });
  }

  static async createAccount({
    encryptedBackupPhrase,
    rootNode,
    chain,
    identitiesToGenerate = 1,
  }: {
    encryptedBackupPhrase: string;
    rootNode: BIP32Interface;
    chain: ChainID;
    identitiesToGenerate?: number;
  }) {
    const derivedIdentitiesKey = rootNode.deriveHardened(CONFIG_INDEX).privateKey;
    if (!derivedIdentitiesKey) {
      throw new TypeError('Unable to derive config key for wallet identities');
    }
    const configPrivateKey = derivedIdentitiesKey.toString('hex');
    const { childKey: stxAddressKeychain } = deriveStxAddressChain(chain)(rootNode);
    const walletAttrs = await getBlockchainIdentities(rootNode, identitiesToGenerate);

    return new Wallet({
      ...walletAttrs,
      chain,
      configPrivateKey,
      stxAddressKeychain,
      encryptedBackupPhrase,
    });
  }

  /**
   * Restore all previously used identities. This is meant to be used when 'restoring' a wallet.
   * First, it will check for a `walletConfig`. If present, then we use that to determine how
   * many identities to generate, and auto-populate their username.
   *
   * If `walletConfig` is empty, then this is being restored from an authenticator that doesn't
   * support `walletConfig`. In that case, we will recursively generate identities, and check for
   * on-chain names.
   *
   */
  async restoreIdentities({
    rootNode,
    gaiaReadURL,
  }: {
    rootNode: bip32.BIP32Interface;
    gaiaReadURL: string;
  }) {
    const gaiaConfig = await makeReadOnlyGaiaConfig({
      readURL: gaiaReadURL,
      privateKey: this.configPrivateKey,
    });
    await this.fetchConfig(gaiaConfig);
    if (this.walletConfig) {
      const getIdentities = this.walletConfig.identities.map(async (identityConfig, index) => {
        let identity: Identity | null = this.identities[index];
        if (!identity) {
          identity = await makeIdentity(rootNode, index);
        }
        if (identityConfig.username) {
          identity.usernames = [identityConfig.username];
          identity.defaultUsername = identityConfig.username;
        }
        return identity;
      });
      const identities = await Promise.all(getIdentities);
      this.identities = identities;
      return this;
    }
    await this.identities[0].refresh();
    const newIdentities = await recursiveRestoreIdentities({ rootNode });
    this.identities = this.identities.concat(newIdentities);
    return this;
  }

  async createNewIdentity(password: string) {
    const plainTextBuffer = await decrypt(Buffer.from(this.encryptedBackupPhrase, 'hex'), password);
    const seed = await mnemonicToSeed(plainTextBuffer);
    const rootNode = bip32.fromSeed(seed);
    const index = this.identities.length;
    const identity = await makeIdentity(rootNode, index);
    this.identities.push(identity);
    this.identityKeypairs.push(identity.keyPair);
    this.identityAddresses.push(identity.address);
    return identity;
  }

  async createGaiaConfig(gaiaHubUrl: string) {
    return connectToGaiaHub(gaiaHubUrl, this.configPrivateKey);
  }

  async fetchConfig(gaiaConfig: GaiaHubConfig): Promise<WalletConfig | null> {
    try {
      const response = await fetch(
        `${gaiaConfig.url_prefix}${gaiaConfig.address}/wallet-config.json`
      );
      const encrypted = await response.text();
      const configJSON = (await decryptContent(encrypted, {
        privateKey: this.configPrivateKey,
      })) as string;
      const config: WalletConfig = JSON.parse(configJSON);
      this.walletConfig = config;
      return config;
    } catch (error) {
      return null;
    }
  }

  async getOrCreateConfig(gaiaConfig: GaiaHubConfig): Promise<WalletConfig> {
    if (this.walletConfig) {
      return this.walletConfig;
    }
    const config = await this.fetchConfig(gaiaConfig);
    if (config) {
      return config;
    }
    const newConfig: WalletConfig = {
      identities: this.identities.map(i => ({
        username: i.defaultUsername,
        address: i.address,
        apps: {},
      })),
    };
    this.walletConfig = newConfig;
    await this.updateConfig(gaiaConfig);
    return newConfig;
  }

  async updateConfig(gaiaConfig: GaiaHubConfig): Promise<void> {
    const publicKey = getPublicKeyFromPrivate(this.configPrivateKey);
    const encrypted = await encryptContent(JSON.stringify(this.walletConfig), { publicKey });
    await uploadToGaiaHub('wallet-config.json', encrypted, gaiaConfig, 'application/json');
  }

  async updateConfigWithAuth({
    identityIndex,
    app,
    gaiaConfig,
  }: {
    identityIndex: number;
    app: ConfigApp;
    gaiaConfig: GaiaHubConfig;
  }) {
    const { walletConfig } = this;
    assertIsTruthy<WalletConfig>(walletConfig);

    this.identities.forEach((identity, index) => {
      const configIdentity = walletConfig.identities[index];
      if (configIdentity) {
        configIdentity.apps = configIdentity.apps || {};
        configIdentity.username = identity.defaultUsername;
        configIdentity.address = identity.address;
        walletConfig.identities[index] = configIdentity;
      } else {
        this.walletConfig?.identities.push({
          username: identity.defaultUsername,
          address: identity.address,
          apps: {},
        });
      }
    });

    const identity = walletConfig.identities[identityIndex];
    identity.apps = identity.apps || {};
    identity.apps[app.origin] = app;
    walletConfig.identities[identityIndex] = identity;
    this.walletConfig = walletConfig;
    await this.updateConfig(gaiaConfig);
  }

  async updateConfigForReuseWarning({ gaiaConfig }: { gaiaConfig: GaiaHubConfig }) {
    assertIsTruthy<WalletConfig>(this.walletConfig);

    this.walletConfig.hideWarningForReusingIdentity = true;

    await this.updateConfig(gaiaConfig);
  }
}

export default Wallet;
