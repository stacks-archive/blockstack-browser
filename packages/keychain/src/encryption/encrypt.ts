import { mnemonicToEntropy, validateMnemonic } from 'bip39'
import {
  randomBytes,
  pbkdf2Sync,
  createCipheriv,
  createHmac,
  createHash
} from 'crypto-browserify'

async function normalizeMnemonic(mnemonic: string) {
  return mnemonicToEntropy(mnemonic)
}

async function encryptMnemonic(
  mnemonic: string,
  password: string
): Promise<Buffer> {
  // must be bip39 mnemonic
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Not a valid bip39 nmemonic')
  }

  // normalize plaintext to fixed length byte string
  const plaintextNormalized = Buffer.from(
    await normalizeMnemonic(mnemonic),
    'hex'
  )

  // AES-128-CBC with SHA256 HMAC
  const salt = randomBytes(16)
  const keysAndIV = pbkdf2Sync(password, salt, 100000, 48, 'sha512')
  const encKey = keysAndIV.slice(0, 16)
  const macKey = keysAndIV.slice(16, 32)
  const iv = keysAndIV.slice(32, 48)

  const cipher = createCipheriv('aes-128-cbc', encKey, iv)
  let cipherText = cipher.update(plaintextNormalized, '', 'hex')
  cipherText += cipher.final('hex')

  const hmacPayload = Buffer.concat([salt, Buffer.from(cipherText, 'hex')])

  const hmac = createHmac('sha256', macKey)
  hmac.write(hmacPayload)
  const hmacDigest = hmac.digest()

  return Buffer.concat([salt, hmacDigest, Buffer.from(cipherText, 'hex')])
}

export async function encryptMain(mnemonic: string, password: string) {
  // logger.debug("Encrypting from worker", mnemonic, password);
  const encryptedBuffer = await encryptMnemonic(mnemonic, password)
  return encryptedBuffer.toString('hex')
}

export async function encrypt(plaintextBuffer: Buffer, password: string) {
  const mnemonic = plaintextBuffer.toString()
  return encryptMain(mnemonic, password)
  // const encryptedBuffer = await encryptMnemonic(mnemonic, password);
  // return encryptedBuffer.toString("hex");
}
