import bip39 from 'bip39'
import { PrivateKeychain } from 'blockstack-keychains'
import { decrypt } from './encryption-utils'

const backupPhraseLength = 24

export function isPasswordValid(password) {
  let isValid = false,
      error = null

  if (password.length >= 8) {
    isValid = true
    error = 'Password must be at least 8 characters'
  }

  return { isValid: isValid, error: error }
}

export function isBackupPhraseValid(backupPhrase) {
  let isValid = true,
      error = null

  if (backupPhrase.split(' ').length !== backupPhraseLength) {
    isValid = false
    error = `Backup phrase must be ${backupPhraseLength} words long`
  } else if (!bip39.validateMnemonic(backupPhrase)) {
    isValid = false
    error = 'Backup phrase is not a valid set of words'
  }

  return { isValid: isValid, error: error }
}

export function decryptPrivateKeychain(password, encryptedBackupPhrase) {
  return new Promise((resolve, reject) => {
    let dataBuffer = new Buffer(encryptedBackupPhrase, 'hex')

    decrypt(dataBuffer, password, (err, plaintextBuffer) => {
      if (!err) {
        const backupPhrase = plaintextBuffer.toString()
        const privateKeychain = PrivateKeychain.fromMnemonic(backupPhrase)
        resolve(privateKeychain)
      } else {
        reject("Incorrect password")
      }
    })
  })
}

export function getBitcoinPrivateKeychain(privateKeychain) {
  return privateKeychain.privatelyNamedChild('bitcoin-0')
}

export function getIdentityPrivateKeychain(privateKeychain) {
  return privateKeychain.privatelyNamedChild('blockstack-0')
}

export function getWebAccountTypes(api) {
  const webAccountTypes = {
    'twitter': {
      label: 'Twitter', iconClass: 'fa-twitter', social: true,
      urlTemplate: 'https://twitter.com/{identifier}'
    },
    'facebook': {
      label: 'Facebook', iconClass: 'fa-facebook', social: true,
      urlTemplate: 'https://facebook.com/{identifier}'
    },
    'github': {
      label: 'GitHub', iconClass: 'fa-github-alt', social: true,
      urlTemplate: 'https://github.com/{identifier}'
    },
    'instagram': {
      label: 'Instagram', iconClass: 'fa-instagram', social: true,
      urlTemplate: 'https://instagram.com/{identifier}'
    },
    'linkedin': {
      label: 'LinkedIn', iconClass: 'fa-linkedin', social: true,
      urlTemplate: 'https://www.linkedin.com/in/{identifier}'
    },
    'tumblr': {
      label: 'Tumblr', iconClass: 'fa-tumblr', social: true,
      urlTemplate: 'http://{identifier}.tumblr.com'
    },
    'reddit': {
      label: 'Reddit', iconClass: 'fa-reddit-alien', social: true,
      urlTemplate: 'https://www.reddit.com/user/{identifier}'
    },
    'pinterest': {
      label: 'Pinterest', iconClass: 'fa-pinterest', social: true,
      urlTemplate: 'https://pinterest.com/{identifier}'
    },
    'youtube': {
      label: 'YouTube', iconClass: 'fa-youtube', social: true,
      urlTemplate: 'https://www.youtube.com/channel/{identifier}'
    },
    'google-plus': {
      label: 'Google+', iconClass: 'fa-google-plus', social: true,
      urlTemplate: 'https://plus.google.com/u/{identifier}'
    },
    'angellist': {
      label: 'AngelList', iconClass: 'fa-angellist', social: true,
      urlTemplate: 'https://angel.co/{identifier}'
    },
    'stack-overflow': {
      label: 'StackOverflow', iconClass: 'fa-stack-overflow', social: true,
      urlTemplate: 'http://stackoverflow.com/users/{identifier}'
    },
    'hacker-news': {
      label: 'Hacker News', iconClass: 'fa-hacker-news', social: true,
      urlTemplate: 'https://news.ycombinator.com/user?id={identifier}'
    },
    'openbazaar': {
      label: 'OpenBazaar', iconClass: 'fa-shopping-cart', social: true,
      urlTemplate: 'ob://{identifier}'
    },
    'snapchat': {
      label: 'Snapchat', iconClass: 'fa-snapchat-ghost', social: true,
      urlTemplate: 'https://snapchat.com/add/{identifier}'
    },
    'website': {
      label: 'Website', iconClass: 'fa-link', social: false,
      urlTemplate: '{identifier}'
    },
    'ssh': {
      label: 'SSH', iconClass: 'fa-key', social: false
    },
    'pgp': {
      label: 'PGP', iconClass: 'fa-key', social: false,
      urlTemplate: api.pgpKeyUrl
    },
    'bitcoin': {
      label: 'Bitcoin', iconClass: 'fa-bitcoin', social: false,
      urlTemplate: api.bitcoinAddressUrl
    },
    'ethereum': {
      label: 'Ethereum', iconClass: 'fa-key', social: false,
      urlTemplate: api.ethereumAddressUrl
    }
  }
  return webAccountTypes
}
