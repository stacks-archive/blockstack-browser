import { ServerAPI } from './server-utils'
import log4js from 'log4js'
const logger = log4js.getLogger(__filename)

export function sendRecoveryEmail(
  email, blockstackId, encryptedSeed
) {
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
  email, blockstackId, encryptedSeed
) {
  const { protocol, hostname, port } = location
  const thisUrl = `${protocol}//${hostname}${port && `:${port}`}`
  const seedRecovery = `${thisUrl}/seed?encrypted=${encodeURIComponent(
    encryptedSeed
  )}`

  return ServerAPI.post('/restore', {
    email,
    encryptedSeed,
    blockstackId,
    seedRecovery
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
