// @flow
import { ServerAPI } from './server-utils'
import log4js from 'log4js'
const logger = log4js.getLogger(__filename)

export function sendRecoveryEmail(
  email: string, blockstackId?: string, encryptedSeed: string
): Promise<any> {
  const { protocol, hostname, port } = location
  const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
  const seedRecovery = `${thisUrl}/seed?encrypted=${encodeURIComponent(
    encryptedSeed
  )}`

  return ServerAPI.post('/recovery', {
    email,
    seedRecovery,
    blockstackId
  })
    .then(
      () => {
        logger.log(`email-utils: sent ${email} recovery email`)
      },
      error => {
        logger.error('email-utils: error', error)
        throw error
      }
    )
    .catch(error => {
      logger.error('email-utils: error', error)
      throw error
    })
}

export function sendRestoreEmail(
  email: string, blockstackId?: string, encryptedSeed: string
): Promise<any> {
  return ServerAPI.post('/restore', {
    email,
    encryptedSeed,
    blockstackId
  })
    .then(
      () => {
        logger.log(`email-utils: sent ${email} restore email`)
      },
      error => {
        logger.error('email-utils: error', error)
        throw error
      }
    )
    .catch(error => {
      logger.error('email-utils: error', error)
      throw error
    })
}
