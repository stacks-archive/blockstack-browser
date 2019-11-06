import { decryptMnemonic } from 'blockstack/lib/encryption/wallet'
import { decrypt as triplesecDecrypt } from 'triplesec'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

export async function decrypt(hexEncryptedKey, password) {
  logger.debug('Decrypting from worker!')
  const dataBuffer = Buffer.from(hexEncryptedKey, 'hex')
  try {
    return await decryptMnemonic(dataBuffer, password, triplesecDecrypt)
  } catch (err) {
    logger.error('Could not decrypt.', err)
    throw err
  }
}
