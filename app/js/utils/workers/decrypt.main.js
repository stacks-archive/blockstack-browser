import crypto from 'crypto'
import triplesec from 'triplesec'
import * as bip39 from 'bip39'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)
async function denormalizeMnemonic(normalizedMnemonic) {
  const result = bip39.entropyToMnemonic(normalizedMnemonic)
  return Promise.resolve(result)
}

async function decryptMnemonic(dataBuffer, password) {
  const salt = dataBuffer.slice(0, 16)
  const hmacSig = dataBuffer.slice(16, 48) // 32 bytes
  const cipherText = dataBuffer.slice(48)
  const hmacPayload = Buffer.concat([salt, cipherText])

  /** @type {Buffer} */
  const keysAndIV = await new Promise((resolve, reject) => {
    crypto.pbkdf2(password, salt, 100000, 48, 'sha512', (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
  const encKey = keysAndIV.slice(0, 16)
  const macKey = keysAndIV.slice(16, 32)
  const iv = keysAndIV.slice(32, 48)

  const decipher = crypto.createDecipheriv('aes-128-cbc', encKey, iv)
  let plaintext = decipher.update(cipherText, '', 'hex')
  plaintext += decipher.final('hex')

  const hmac = crypto.createHmac('sha256', macKey)
  hmac.write(hmacPayload)
  const hmacDigest = hmac.digest()

  // hash both hmacSig and hmacDigest so string comparison time
  // is uncorrelated to the ciphertext
  const hmacSigHash = crypto
    .createHash('sha256')
    .update(hmacSig)
    .digest()
    .toString('hex')

  const hmacDigestHash = crypto
    .createHash('sha256')
    .update(hmacDigest)
    .digest()
    .toString('hex')

  if (hmacSigHash !== hmacDigestHash) {
    // not authentic
    throw new Error('Wrong password (HMAC mismatch)')
  }

  const mnemonic = await denormalizeMnemonic(plaintext)
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Wrong password (invalid plaintext)')
  }

  return mnemonic
}

function decryptLegacy(dataBuffer, password) {
  return new Promise((resolve, reject) => {
    triplesec.decrypt(
      {
        key: Buffer.from(password),
        data: dataBuffer
      },
      (err, plaintextBuffer) => {
        if (!err) {
          resolve(plaintextBuffer)
        } else {
          reject(err)
        }
      }
    )
  })
}

export async function decrypt(hexEncryptedKey, password) {
  logger.debug('Decrypting from worker!')
  const dataBuffer = Buffer.from(hexEncryptedKey, 'hex')
  let mnemonic

  try {
    mnemonic = await decryptMnemonic(dataBuffer, password)
  } catch (err) {
    logger.error('Could not decrypt.', err)

    try {
      logger.debug('Trying to decrypt with legacy function.')
      mnemonic = await decryptLegacy(dataBuffer, password)
    } catch (e) {
      mnemonic = null
      logger.error('Could not decrypt again, most likely wrong password.')
      throw Error('Wrong Password.')
    }
  }
  return mnemonic.toString()
}
