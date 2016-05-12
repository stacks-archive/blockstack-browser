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

export const socialMediaClasses = new Map([
  ['twitter', 'fa-twitter'],
  ['facebook', 'fa-facebook'],
  ['github', 'fa-github'],
  ['linkedin', 'fa-linkedin'],
  ['instagram', 'fa-instagram'],
  ['pinterest', 'fa-pinterest'],
  ['reddit', 'fa-reddit'],
  ['youtube', 'fa-youtube'],
  ['tumblr', 'fa-tumblr'],
  ['google-plus', 'fa-google-plus'],
  ['stack-overflow', 'fa-stack-overflow'],
  ['angellist', 'fa-angellist'],
  ['hacker-news', 'fa-hacker-news'],
  ['bitcoin', 'fa-bitcoin'],
  ['pgp', 'fa-key'],
  ['website', 'fa-link'],
  ['openbazaar', 'fa-shopping-cart']
])