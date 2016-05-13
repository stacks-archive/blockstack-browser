import bip39 from 'bip39'

const backupPhraseLength = 24

export function isPasswordValid(password) {
  let isValid = false,
      error = null

  if (password.length > 8) {
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

export const webAccountTypes = {
  'twitter': {
    label: 'Twitter', iconClass: 'fa-twitter', social: true
  },
  'facebook': {
    label: 'Facebook', iconClass: 'fa-facebook', social: true
  },
  'github': {
    label: 'GitHub', iconClass: 'fa-github', social: true
  },
  'instagram': {
    label: 'Instagram', iconClass: 'fa-instagram', social: true
  },
  'linkedin': {
    label: 'LinkedIn', iconClass: 'fa-linkedin', social: true
  },
  'tumblr': {
    label: 'Tumblr', iconClass: 'fa-tumblr', social: true
  },
  'reddit': {
    label: 'Reddit', iconClass: 'fa-reddit', social: true
  },
  'pinterest': {
    label: 'Pinterest', iconClass: 'fa-pinterest', social: true
  },
  'youtube': {
    label: 'YouTube', iconClass: 'fa-youtube', social: true
  },
  'google-plus': {
    label: 'Google+', iconClass: 'fa-google-plus', social: true
  },
  'angellist': {
    label: 'AngelList', iconClass: 'fa-angellist', social: true
  },
  'stack-overflow': {
    label: 'StackOverflow', iconClass: 'fa-stack-overflow', social: true
  },
  'hacker-news': {
    label: 'Hacker News', iconClass: 'fa-hacker-news', social: true
  },
  'openbazaar': {
    label: 'OpenBazaar', iconClass: 'fa-shopping-cart', social: true
  },
  'snapchat': {
    label: 'Snapchat', iconClass: 'fa-snapchat', social: true
  },
  'website': {
    label: 'Website', iconClass: 'fa-link', social: false
  },
  'pgp': {
    label: 'PGP', iconClass: 'fa-key', social: false
  },
  'bitcoin': {
    label: 'Bitcoin', iconClass: 'fa-bitcoin', social: false
  }
}
