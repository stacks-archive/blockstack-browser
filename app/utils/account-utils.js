import bip39 from 'bip39'

const backupPhraseLength = 24

export function isPasswordValid(password) {
  let isValid = true,
      error = null

  if (password.length < 8) {
    isValid = false
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