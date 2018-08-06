import bip39 from 'bip39'
import log4js from 'log4js'
import { BlockstackWallet, publicKeyToAddress, getPublicKeyFromPrivate } from 'blockstack'

const logger = log4js.getLogger('utils/account-utils.js')

const SINGLE_PLAYER_APP_DOMAIN_LEGACY_LIST = ['https://blockstack-todos.appartisan.com',
                                              'https://use.coinsapp.co',
                                              'http://www.coinstack.one',
                                              'http://www.blockportfol.io',
                                              'http://lioapp.io',
                                              'http://coindexapp.herokuapp.com',
                                              'https://peachyportfolio.com']
export const MAX_TRUST_LEVEL = 99

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

export async function decryptBitcoinPrivateKey(password, encryptedBackupPhrase) {
  const wallet = await BlockstackWallet.fromEncryptedMnemonic(encryptedBackupPhrase, password)
  return wallet.getBitcoinPrivateKey(0)
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

export function getBlockchainIdentities(keychainB58, identitiesToGenerate) {
  const wallet = BlockstackWallet.fromBase58(keychainB58)

  const identityPublicKeychainNode = wallet.getIdentityPublicKeychain()
  const identityPublicKeychain = identityPublicKeychainNode.toBase58()

  const bitcoinPublicKeychainNode = wallet.getBitcoinPublicKeychain()
  const bitcoinPublicKeychain = bitcoinPublicKeychainNode.toBase58()

  const firstBitcoinAddress = wallet.getBitcoinAddress(0)

  const identityAddresses = []
  const identityKeypairs = []

  // We pre-generate a number of identity addresses so that we
  // don't have to prompt the user for the password on each new profile
  for (
    let addressIndex = 0;
    addressIndex < identitiesToGenerate;
    addressIndex++
  ) {
    const identityKeyPair = wallet.getIdentityKeyPair(addressIndex, true)
    identityKeypairs.push(identityKeyPair)
    identityAddresses.push(identityKeyPair.address)
    logger.debug(`createAccount: identity index: ${addressIndex}`)
  }

  return {
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityAddresses,
    identityKeypairs
  }
}
