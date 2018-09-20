import crypto from 'crypto'

async function normalizeMnemonic(mnemonic) {
  const bip39 = await import(/* webpackChunkName: 'bip39' */ 'bip39')
  return bip39.mnemonicToEntropy(mnemonic).toString('hex')
}

async function encryptMnemonic(mnemonic, password) {
  // must be bip39 mnemonic
  const bip39 = await import(/* webpackChunkName: 'bip39' */ 'bip39')
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error('Not a valid bip39 nmemonic')
  }

  // normalize plaintext to fixed length byte string
  const plaintextNormalized = Buffer.from(await normalizeMnemonic(mnemonic), 'hex')

  // AES-128-CBC with SHA256 HMAC
  const salt = crypto.randomBytes(16)
  const keysAndIV = crypto.pbkdf2Sync(password, salt, 100000, 48, 'sha512')
  const encKey = keysAndIV.slice(0, 16)
  const macKey = keysAndIV.slice(16, 32)
  const iv = keysAndIV.slice(32, 48)

  const cipher = crypto.createCipheriv('aes-128-cbc', encKey, iv)
  let cipherText = cipher.update(plaintextNormalized, '', 'hex')
  cipherText += cipher.final('hex')

  const hmacPayload = Buffer.concat([salt, Buffer.from(cipherText, 'hex')])

  const hmac = crypto.createHmac('sha256', macKey)
  hmac.write(hmacPayload)
  const hmacDigest = hmac.digest()

  return Buffer.concat([salt, hmacDigest, Buffer.from(cipherText, 'hex')])
}

export async function encrypt(mnemonic, password) {
  console.log('encryptWorker')
  const encryptedBuffer = await encryptMnemonic(mnemonic, password)
  return encryptedBuffer.toString('hex')
}
