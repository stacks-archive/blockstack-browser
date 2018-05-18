import bip39 from 'bip39'
import { decrypt } from './encryption-utils'
import { HDNode } from 'bitcoinjs-lib'
import crypto from 'crypto'
import log4js from 'log4js'
import { BlockstackWallet, publicKeyToAddress, getPublicKeyFromPrivate } from 'blockstack'

const logger = log4js.getLogger('utils/account-utils.js')

function hashCode(string) {
  let hash = 0
  if (string.length === 0) return hash
  for (let i = 0; i < string.length; i++) {
    const character = string.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash = hash & hash
  }
  return hash & 0x7fffffff
}

const APPS_NODE_INDEX = 0
const SIGNING_NODE_INDEX = 1
const ENCRYPTION_NODE_INDEX = 2
const SINGLE_PLAYER_APP_DOMAIN_LEGACY_LIST = ['https://blockstack-todos.appartisan.com',
                                              'https://use.coinsapp.co',
                                              'http://www.coinstack.one',
                                              'http://www.blockportfol.io',
                                              'http://lioapp.io',
                                              'http://coindexapp.herokuapp.com',
                                              'https://peachyportfolio.com']
export const MAX_TRUST_LEVEL = 99

export class AppNode {
  constructor(hdNode, appDomain) {
    this.hdNode = hdNode
    this.appDomain = appDomain
  }

  getAppPrivateKey() {
    return this.hdNode.keyPair.d.toBuffer(32).toString('hex')
  }

  getAddress() {
    return this.hdNode.getAddress()
  }
}

export class AppsNode {
  constructor(appsHdNode, salt) {
    this.hdNode = appsHdNode
    this.salt = salt
  }

  getNode() {
    return this.hdNode
  }

  getAppNode(appDomain) {
    const hash = crypto
      .createHash('sha256')
      .update(`${appDomain}${this.salt}`)
      .digest('hex')
    const appIndex = hashCode(hash)
    const appNode = this.hdNode.deriveHardened(appIndex)
    return new AppNode(appNode, appDomain)
  }

  toBase58() {
    return this.hdNode.toBase58()
  }

  getSalt() {
    return this.salt
  }
}

class IdentityAddressOwnerNode {
  constructor(ownerHdNode, salt) {
    this.hdNode = ownerHdNode
    this.salt = salt
  }

  getNode() {
    return this.hdNode
  }

  getSalt() {
    return this.salt
  }

  getIdentityKey() {
    return this.hdNode.keyPair.d.toBuffer(32).toString('hex')
  }

  getIdentityKeyID() {
    return this.hdNode.keyPair.getPublicKeyBuffer().toString('hex')
  }

  getAppsNode() {
    return new AppsNode(this.hdNode.deriveHardened(APPS_NODE_INDEX), this.salt)
  }

  getAddress() {
    return this.hdNode.getAddress()
  }

  getEncryptionNode() {
    return this.hdNode.deriveHardened(ENCRYPTION_NODE_INDEX)
  }

  getSigningNode() {
    return this.hdNode.deriveHardened(SIGNING_NODE_INDEX)
  }
}

export function isPasswordValid(password) {
  let isValid = false
  let error = null

  if (password.length >= 8) {
    isValid = true
    error = 'Password must be at least 8 characters'
  }

  return { isValid, error }
}

export function isBackupPhraseValid(backupPhrase) {
  let isValid = true
  let error = null

  if (!bip39.validateMnemonic(backupPhrase)) {
    isValid = false
    error = 'Backup phrase is not a valid set of words'
  }

  return { isValid, error }
}

export function decryptMasterKeychain(password, encryptedBackupPhrase) {
  return new Promise((resolve, reject) => {
    const dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')
    decrypt(dataBuffer, password).then(
      plaintextBuffer => {
        const backupPhrase = plaintextBuffer.toString()
        const seed = bip39.mnemonicToSeed(backupPhrase)
        const masterKeychain = HDNode.fromSeedBuffer(seed)
        logger.trace('decryptMasterKeychain: decrypted!')
        resolve(masterKeychain)
      },
      error => {
        logger.error('decryptMasterKeychain: error', error)
        reject(new Error('Incorrect password'))
      }
    )
  })
}

const EXTERNAL_ADDRESS = 'EXTERNAL_ADDRESS'
const CHANGE_ADDRESS = 'CHANGE_ADDRESS'

export function getBitcoinPrivateKeychain(masterKeychain) {
  const BIP_44_PURPOSE = 44
  const BITCOIN_COIN_TYPE = 0
  const ACCOUNT_INDEX = 0

  return masterKeychain
    .deriveHardened(BIP_44_PURPOSE)
    .deriveHardened(BITCOIN_COIN_TYPE)
    .deriveHardened(ACCOUNT_INDEX)
}

export function getBitcoinPublicKeychain(masterKeychain) {
  return getBitcoinPrivateKeychain(masterKeychain).neutered()
}

export function getBitcoinAddressNode(
  bitcoinKeychain,
  addressIndex = 0,
  chainType = EXTERNAL_ADDRESS
) {
  let chain = null

  if (chainType === EXTERNAL_ADDRESS) {
    chain = 0
  } else if (chainType === CHANGE_ADDRESS) {
    chain = 1
  } else {
    throw new Error('Invalid chain type')
  }

  return bitcoinKeychain.derive(chain).derive(addressIndex)
}

export function decryptBitcoinPrivateKey(password, encryptedBackupPhrase) {
  return new Promise((resolve, reject) =>
    decryptMasterKeychain(password, encryptedBackupPhrase)
      .then(masterKeychain => {
        const bitcoinPrivateKeychain = getBitcoinPrivateKeychain(masterKeychain)
        const bitcoinAddressHDNode = getBitcoinAddressNode(bitcoinPrivateKeychain, 0)
        const privateKey = bitcoinAddressHDNode.keyPair.d.toBuffer(32).toString('hex')
        resolve(privateKey)
      })
      .catch(error => {
        reject(error)
      })
  )
}

const IDENTITY_KEYCHAIN = 888
const BLOCKSTACK_ON_BITCOIN = 0
export function getIdentityPrivateKeychain(masterKeychain) {
  return masterKeychain.deriveHardened(IDENTITY_KEYCHAIN).deriveHardened(BLOCKSTACK_ON_BITCOIN)
}

export function getIdentityPublicKeychain(masterKeychain) {
  return getIdentityPrivateKeychain(masterKeychain).neutered()
}

export function getIdentityOwnerAddressNode(identityPrivateKeychain, identityIndex = 0) {
  if (identityPrivateKeychain.isNeutered()) {
    throw new Error('You need the private key to generate identity addresses')
  }

  const publicKeyHex = identityPrivateKeychain.keyPair.getPublicKeyBuffer().toString('hex')
  const salt = crypto
    .createHash('sha256')
    .update(publicKeyHex)
    .digest('hex')

  return new IdentityAddressOwnerNode(identityPrivateKeychain.deriveHardened(identityIndex), salt)
}

export function deriveIdentityKeyPair(identityOwnerAddressNode) {
  const address = identityOwnerAddressNode.getAddress()
  const identityKey = identityOwnerAddressNode.getIdentityKey()
  const identityKeyID = identityOwnerAddressNode.getIdentityKeyID()
  const appsNode = identityOwnerAddressNode.getAppsNode()
  const keyPair = {
    key: identityKey,
    keyID: identityKeyID,
    address,
    appsNodeKey: appsNode.toBase58(),
    salt: appsNode.getSalt()
  }
  return keyPair
}

export function getWebAccountTypes(api) {
  const webAccountTypes = {
    twitter: {
      label: 'Twitter',
      iconClass: 'fa-twitter',
      social: true,
      urlTemplate: 'https://twitter.com/{identifier}'
    },
    facebook: {
      label: 'Facebook',
      iconClass: 'fa-facebook',
      social: true,
      urlTemplate: 'https://facebook.com/{identifier}'
    },
    github: {
      label: 'GitHub',
      iconClass: 'fa-github-alt',
      social: true,
      urlTemplate: 'https://github.com/{identifier}'
    },
    instagram: {
      label: 'Instagram',
      iconClass: 'fa-instagram',
      social: true,
      urlTemplate: 'https://instagram.com/{identifier}'
    },
    linkedIn: {
      label: 'LinkedIn',
      iconClass: 'fa-linkedin',
      social: true,
      urlTemplate: 'https://www.linkedin.com/in/{identifier}'
    },
    tumblr: {
      label: 'Tumblr',
      iconClass: 'fa-tumblr',
      social: true,
      urlTemplate: 'http://{identifier}.tumblr.com'
    },
    reddit: {
      label: 'Reddit',
      iconClass: 'fa-reddit-alien',
      social: true,
      urlTemplate: 'https://www.reddit.com/user/{identifier}'
    },
    pinterest: {
      label: 'Pinterest',
      iconClass: 'fa-pinterest',
      social: true,
      urlTemplate: 'https://pinterest.com/{identifier}'
    },
    youtube: {
      label: 'YouTube',
      iconClass: 'fa-youtube',
      social: true,
      urlTemplate: 'https://www.youtube.com/channel/{identifier}'
    },
    'google-plus': {
      label: 'Google+',
      iconClass: 'fa-google-plus',
      social: true,
      urlTemplate: 'https://plus.google.com/u/{identifier}'
    },
    angellist: {
      label: 'AngelList',
      iconClass: 'fa-angellist',
      social: true,
      urlTemplate: 'https://angel.co/{identifier}'
    },
    'stack-overflow': {
      label: 'StackOverflow',
      iconClass: 'fa-stack-overflow',
      social: true,
      urlTemplate: 'http://stackoverflow.com/users/{identifier}'
    },
    hackerNews: {
      label: 'Hacker News',
      iconClass: 'fa-hacker-news',
      social: true,
      urlTemplate: 'https://news.ycombinator.com/user?id={identifier}'
    },
    openbazaar: {
      label: 'OpenBazaar',
      iconClass: 'fa-shopping-cart',
      social: true,
      urlTemplate: 'ob://{identifier}'
    },
    snapchat: {
      label: 'Snapchat',
      iconClass: 'fa-snapchat-ghost',
      social: true,
      urlTemplate: 'https://snapchat.com/add/{identifier}'
    },
    website: {
      label: 'Website',
      iconClass: 'fa-link',
      social: false,
      urlTemplate: '{identifier}'
    },
    ssh: {
      label: 'SSH',
      iconClass: 'fa-key',
      social: false
    },
    pgp: {
      label: 'PGP',
      iconClass: 'fa-key',
      social: false
    },
    bitcoin: {
      label: 'Bitcoin',
      iconClass: 'fa-bitcoin',
      social: false,
      urlTemplate: api.bitcoinAddressUrl
    },
    ethereum: {
      label: 'Ethereum',
      iconClass: 'fa-key',
      social: false,
      urlTemplate: api.ethereumAddressUrl
    }
  }
  return webAccountTypes
}

export function calculateTrustLevel(verifications) {
  if (!verifications || verifications.length < 1) {
    return 0
  }

  let trustLevel = 0
  verifications.forEach(verification => {
    if (verification.valid && trustLevel < MAX_TRUST_LEVEL) {
      trustLevel++
    }
  })

  return trustLevel
}

export function calculateProfileCompleteness(profile, verifications) {
  let complete = 0
  const totalItems = 2
  const maxVerificationItems = 1

  if (profile.name && profile.name.length > 0) {
    complete++
  }

  // if (profile.description && profile.description.length > 0) {
  //   complete++
  // }

  // if (profile.image && profile.image.length > 0) {
  //   complete++
  // }

  complete += Math.min(calculateTrustLevel(verifications), maxVerificationItems)

  return complete / totalItems
}

export function findAddressIndex(address, identityAddresses) {
  for (let i = 0; i < identityAddresses.length; i++) {
    if (identityAddresses[i] === address) {
      return i
    }
  }
  return null
}

export function getCorrectAppPrivateKey(scopes, profile, appsNodeKey, salt, appDomain) {
  const appPrivateKey = BlockstackWallet.getAppPrivateKey(appsNodeKey, salt, appDomain)
  const legacyAppPrivateKey = BlockstackWallet.getLegacyAppPrivateKey(
    appsNodeKey, salt, appDomain)
  if (scopes.publishData) {
    // multiplayer application, let's check if there's a legacy signin.
    if (!profile || !profile.apps || !profile.apps[appDomain]) {
      // first login with this app, use normal private key
      return appPrivateKey
    }
    let appBucketUrl = profile.apps[appDomain]
    if (appBucketUrl.endsWith('/')) {
      appBucketUrl = appBucketUrl.slice(0, -1)
    }
    const legacyAddress = publicKeyToAddress(getPublicKeyFromPrivate(legacyAppPrivateKey))
    if (appBucketUrl.endsWith(`/${legacyAddress}`)) {
      return legacyAppPrivateKey
    }
    return appPrivateKey
  } else {
    if (SINGLE_PLAYER_APP_DOMAIN_LEGACY_LIST.includes(appDomain)) {
      return legacyAppPrivateKey
    } else {
      return appPrivateKey
    }
  }
}
