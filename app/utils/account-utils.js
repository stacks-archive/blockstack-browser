import Mnemonic from 'bitcore-mnemonic'; delete global._bitcore

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

  if (backupPhrase.split(' ').length !== 15) {
    isValid = false
    error = 'Backup phrase must be 15 words long'
  } else if (!Mnemonic.isValid(backupPhrase)) {
    isValid = false
    error = 'Backup phrase is not a valid set of words'
  }

  return { isValid: isValid, error: error }
}