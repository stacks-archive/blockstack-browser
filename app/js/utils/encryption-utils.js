import { validateMnemonic } from 'bip39'
import makeEncryptWorker from './workers/encrypt.worker.js'
import makeDecryptWorker from './workers/decrypt.worker.js'

export function encrypt(plaintextBuffer, password) {
  const mnemonic = plaintextBuffer.toString()
  const encryptWorker = makeEncryptWorker()
  return encryptWorker.encrypt(mnemonic, password)
}

export function decrypt(dataBuffer, password) {
  const encryptedMnemonic = dataBuffer.toString('hex')
  const decryptWorker = makeDecryptWorker()
  return decryptWorker.decrypt(encryptedMnemonic, password)
    .then(mnemonic => Buffer.from(mnemonic))
}


 export const RECOVERY_TYPE = {
   MNEMONIC: 'mnemonic',
   ENCRYPTED: 'encrypted'
 }

 /**
  * Checks if a recovery option is valid, and attempts to clean it up.
  * @param {string} input - User input of recovery method
  * @returns {{ isValid: boolean, cleaned: (string|undefined), type: (string|undefined) }}
  */
export function validateAndCleanRecoveryInput(input) {
  const cleaned = input.trim()

  // Raw mnemonic phrase
  const cleanedMnemonic = cleaned.toLowerCase().split(/\s|-|_|\./).join(' ')

  if (validateMnemonic(cleanedMnemonic)) {
    return {
      isValid: true,
      type: RECOVERY_TYPE.MNEMONIC,
      cleaned: cleanedMnemonic
    }
  }

  // Base64 encoded encrypted phrase
  let cleanedEncrypted = cleaned.replace(/\s/gm, '')

  if (cleanedEncrypted.length === 107 && cleanedEncrypted.indexOf('=') !== 106) {
    // Append possibly missing equals sign padding
    cleanedEncrypted = `${cleanedEncrypted}=`
  }

  if (cleanedEncrypted.length >= 108 && /^[a-zA-Z0-9\+\/]+=$/.test(cleanedEncrypted)) {
    return {
      isValid: true,
      type: RECOVERY_TYPE.ENCRYPTED,
      cleaned: cleanedEncrypted
    }
  }

  return { isValid: false }
}
