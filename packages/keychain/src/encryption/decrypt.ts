import { createHmac, pbkdf2Sync, createHash, createDecipheriv } from 'crypto-browserify'
import * as triplesec from 'triplesec'
import { entropyToMnemonic, validateMnemonic } from 'bip39'
// import { Buffer } from "buffer/"

// eslint-disable-next-line @typescript-eslint/require-await
async function denormalizeMnemonic(normalizedMnemonic: string) {
  // Note: Future-proofing with async wrappers around any synchronous cryptographic code.
  return entropyToMnemonic(normalizedMnemonic)
}

async function decryptMnemonic(dataBuffer: Buffer, password: string) {
  const salt = dataBuffer.slice(0, 16)
  const hmacSig = dataBuffer.slice(16, 48) // 32 bytes
  const cipherText = dataBuffer.slice(48)
  const hmacPayload = Buffer.concat([salt, cipherText])

  const keysAndIV = pbkdf2Sync(password, salt, 100000, 48, 'sha512')
  const encKey = keysAndIV.slice(0, 16)
  const macKey = keysAndIV.slice(16, 32)
  const iv = keysAndIV.slice(32, 48)

  const decipher = createDecipheriv('aes-128-cbc', encKey, iv)
  let plaintext = decipher.update(cipherText).toString('hex')
  plaintext += decipher.final('hex')

  const hmac = createHmac('sha256', macKey)
  hmac.update(hmacPayload)
  const hmacDigest = hmac.digest()

  // hash both hmacSig and hmacDigest so string comparison time
  // is uncorrelated to the ciphertext
  const hmacSigHash = createHash('sha256')
    .update(hmacSig)
    .digest()
    .toString('hex')

  const hmacDigestHash = createHash('sha256')
    .update(hmacDigest)
    .digest()
    .toString('hex')

  if (hmacSigHash !== hmacDigestHash) {
    // not authentic
    throw new Error('Wrong password (HMAC mismatch)')
  }

  const mnemonic = await denormalizeMnemonic(plaintext)
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Wrong password (invalid plaintext)')
  }

  return mnemonic
}

async function decryptLegacy(dataBuffer: Buffer, password: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    triplesec.decrypt(
      {
        key: Buffer.from(password),
        data: dataBuffer
      },
      (err, plaintextBuffer) => {
        if (!err) {
          resolve(plaintextBuffer as Buffer)
        } else {
          reject(err)
        }
      }
    )
  })
}

export async function decryptMain(hexEncryptedKey: string, password: string): Promise<string> {
  // logger.debug("Decrypting from worker!");
  const dataBuffer = Buffer.from(hexEncryptedKey, 'hex')
  let mnemonic: string

  try {
    mnemonic = await decryptMnemonic(dataBuffer, password)
  } catch (err) {
    // logger.error("Could not decrypt.", err);
    // console.error(err)

    try {
      // logger.debug("Trying to decrypt with legacy function.");
      const mnemonicBuffer = await decryptLegacy(dataBuffer, password)
      // console.log(mnemonic)
      mnemonic = mnemonicBuffer.toString()
    } catch (e) {
      // mnemonic = null;
      // logger.error("Could not decrypt again, most likely wrong password.");
      // console.error(e)
      throw Error('Wrong Password.')
    }
  }
  return mnemonic
}

export async function decrypt(dataBuffer: Buffer, password: string) {
  const encryptedMnemonic = dataBuffer.toString('hex')
  const mnemonic = await decryptMain(encryptedMnemonic, password)
  return Buffer.from(mnemonic)
}
