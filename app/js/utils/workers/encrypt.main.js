import { encryptMnemonic } from 'blockstack/lib/encryption/wallet'
import log4js from 'log4js'
const logger = log4js.getLogger(__filename)

export async function encrypt(mnemonic, password) {
  logger.debug('Encrypting from worker', mnemonic, password)
  const encryptedBuffer = await encryptMnemonic(mnemonic, password)
  return encryptedBuffer.toString('hex')
}
