import makeEncryptWorker from './workers/encrypt.worker.js'
import makeDecryptWorker from './workers/decrypt.worker.js'
import bip39 from 'bip39'
import log4js from 'log4js'
const logger = log4js.getLogger(__filename)
export async function encrypt(plaintextBuffer, password) {
  const mnemonic = plaintextBuffer.toString()
  const encryptWorker = makeEncryptWorker()
  return encryptWorker.encrypt(mnemonic, password)
}

export async function decrypt(dataBuffer, password) {
  const encryptedMnemonic = dataBuffer.toString('hex')
  const decryptWorker = makeDecryptWorker()
  const mnemonic = await decryptWorker.decrypt(encryptedMnemonic, password)
  return Buffer.from(mnemonic)
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
  logger.debug('Validate and clean recovery input')
  const cleaned = input.trim()
  logger.debug('cleaned: ', cleaned)

  // Raw mnemonic phrase
  const cleanedMnemonic = cleaned
    .toLowerCase()
    .split(/\s|-|_|\./)
    .join(' ')

  if (bip39.validateMnemonic(cleanedMnemonic)) {
    logger.debug('This is a valid mnemonic.')
    return {
      isValid: true,
      type: RECOVERY_TYPE.MNEMONIC,
      cleaned: cleanedMnemonic
    }
  }
  logger.debug('Is not a valid mnemonic.')

  // Base64 encoded encrypted phrase
  let cleanedEncrypted = cleaned.replace(/\s/gm, '')

  if (
    cleanedEncrypted.length === 107 &&
    cleanedEncrypted.indexOf('=') !== 106
  ) {
    // Append possibly missing equals sign padding
    logger.debug('Encrypted Phrase needs an `=` at the end.')

    cleanedEncrypted = `${cleanedEncrypted}=`
  }

  if (
    cleanedEncrypted.length >= 108 &&
    /^[a-zA-Z0-9\+\/]+=$/.test(cleanedEncrypted)
  ) {
    logger.debug('Valid encrypted phrase!')
    return {
      isValid: true,
      type: RECOVERY_TYPE.ENCRYPTED,
      cleaned: cleanedEncrypted
    }
  }
  logger.debug('Is not a valid phrase!')

  return { isValid: false }
}
