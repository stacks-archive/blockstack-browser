import bip39 from 'bip39'
import crypto from 'crypto'
import triplesec from 'triplesec'

function normalizeMnemonic(mnemonic) {
  // each word in the bip39 mnemonic corresponds
  // to an offset in the bip39 dictionary (of 2048 words).
  // Convert each word into the offset into the dictionary,
  // and convert the list of indexes into a packed binary string
  // of hex triples.
  const words = mnemonic.split(/ +/).filter((word) => word.length > 0)
  const wordIndexes = []
  for (let i = 0; i < words.length; i++) {
    const idx = bip39.wordlists.EN.indexOf(words[i])
    if (idx < 0) {
      throw new Error('BIP39 mnemonic has an unrecognized word')
    }
    wordIndexes.push(idx)
  }

  // each word index is between 1 and 2**11, or 3 hex characters
  // representing a number that is between 0x000 and 0x7ff
  let normalizedMnemonic = ''
  for (let i = 0; i < wordIndexes.length; i++) {
    const hexIdx = `000${wordIndexes[i].toString(16)}`.slice(-3)
    normalizedMnemonic += hexIdx
  }

  return normalizedMnemonic
} 

function denormalizeMnemonic(normalizedMnemonic) {
  // given a hex string where each hex triple
  // is a value between 0 and 2048, convert it
  // into an english bip39 phrase.
  // @normalizedMnemonic is a hex string.
  if (normalizedMnemonic.length % 3 !== 0) {
    throw new Error('Invalid normalized mnemonic--must have a length that is a multiple of 3')
  }

  const words = []
  for (let i = 0; i < normalizedMnemonic.length; i += 3) {
    const hexSlice = normalizedMnemonic.slice(i, i + 3)
    const idx = parseInt(hexSlice, 16)
    if (idx > 2047) {
      throw new Error('Invalid normalized mnemonic--got an index greater than 2047')
    }
    words.push(bip39.wordlists.EN[idx])
  }

  return words.join(' ')
} 

function encryptMnemonic(plaintextBuffer, password) {
  return Promise.resolve().then(() => {
    // must be bip39 mnemonic 
    if (!bip39.validateMnemonic(plaintextBuffer.toString())) {
      throw new Error('Not a valid bip39 nmemonic')
    }

    // normalize plaintext to fixed length byte string
    const plaintextNormalized = Buffer.from(
      normalizeMnemonic(plaintextBuffer.toString()), 'hex')

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

    const payload = Buffer.concat([salt, hmacDigest, Buffer.from(cipherText, 'hex')])
    return payload
  })
}

function decryptMnemonic(dataBuffer, password) {
  return Promise.resolve().then(() => {
    const salt = dataBuffer.slice(0, 16)
    const hmacSig = dataBuffer.slice(16, 48)   // 32 bytes
    const cipherText = dataBuffer.slice(48)
    const hmacPayload = Buffer.concat([salt, cipherText])

    const keysAndIV = crypto.pbkdf2Sync(password, salt, 100000, 48, 'sha512')
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
    const hmacSigHash = crypto.createHash('sha256')
      .update(hmacSig)
      .digest()
      .toString('hex')

    const hmacDigestHash = crypto.createHash('sha256')
      .update(hmacDigest)
      .digest()
      .toString('hex')
    
    if (hmacSigHash !== hmacDigestHash) {
      // not authentic
      throw new Error('Wrong password (HMAC mismatch)')
    }

    const mnemonic = denormalizeMnemonic(plaintext)
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error('Wrong password (invalid plaintext)')
    }

    return mnemonic
  })
}


export function encrypt(plaintextBuffer, password) {
  return encryptMnemonic(plaintextBuffer, password)
}

export function decrypt(dataBuffer, password) {
  return decryptMnemonic(dataBuffer, password)
  .catch(() => // try the old way
    new Promise((resolve, reject) => {
      triplesec.decrypt(
        {
          key: new Buffer(password),
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
  )
}

/*
function normalizeMnemonic(mnemonic) {
  // each word in the bip39 mnemonic corresponds
  // to an offset in the bip39 dictionary (of 2048 words).
  // Convert each word into the offset into the dictionary,
  // and convert the list of indexes into a packed binary string
  // of hex triples.
  const words = mnemonic.split(/ +/).filter((word) => word.length > 0)
  const wordIndexes = []
  for (let i = 0; i < words.length; i++) {
    const idx = bip39.wordlists.EN.indexOf(words[i])
    if (idx < 0) {
      throw new Error('BIP39 mnemonic has an unrecognized word')
    }
    wordIndexes.push(idx)
  }

  // each word index is between 1 and 2**11, or 3 hex characters
  // representing a number that is between 0x000 and 0x7ff
  let normalizedMnemonic = ''
  for (let i = 0; i < wordIndexes.length; i++) {
    const hexIdx = `000${wordIndexes[i].toString(16)}`.slice(-3)
    normalizedMnemonic += hexIdx
  }

  return normalizedMnemonic
} 

function denormalizeMnemonic(normalizedMnemonic) {
  // given a hex string where each hex triple
  // is a value between 0 and 2048, convert it
  // into an english bip39 phrase.
  // @normalizedMnemonic is a hex string.
  if (normalizedMnemonic.length % 3 !== 0) {
    throw new Error('Invalid normalized mnemonic--must have a length that is a multiple of 3')
  }

  const words = []
  for (let i = 0; i < normalizedMnemonic.length; i += 3) {
    const hexSlice = normalizedMnemonic.slice(i, i + 3)
    const idx = parseInt(hexSlice, 16)
    if (idx > 2047) {
      throw new Error('Invalid normalized mnemonic--got an index greater than 2047')
    }
    words.push(bip39.wordlists.EN[idx])
  }

  return words.join(' ')
} 

function encryptMnemonic(plaintextBuffer: Buffer, password: string) {
  return Promise.resolve().then(() => {
    // must be bip39 mnemonic 
    if (!bip39.validateMnemonic(plaintextBuffer.toString())) {
      throw new Error('Not a valid bip39 nmemonic')
    }
    const plaintextNormalized = Buffer.from(plaintextBuffer
      .toString()
      .split(/ +/)
      .filter((word) => word.length > 0)
      .map((word) => {
        // NOTE: bip39 words are 8 characters or less in English
        if (word.length > 8) {
          throw new Error(`Invalid bip39 word ${word}`)
        }
        return `        ${word}`.slice(-8)
      })
      .join(''))

    if (plaintextNormalized.length !== 96 && plaintextNormalized.length !== 192) {
      throw new Error(
        `BUG: normalized plaintext is ${plaintextNormalized.length} bytes (expected 96 or 192)`)
    }

    // Vernam cipher (OTP), where the OTP is derived
    // from a PBKDF2 stream of length equal to the
    // plaintext.  This is sufficient for our purposes,
    // since the plaintext and ciphertext have known
    // length and only the endpoint (i.e. the user)
    // will be decrypting them.  The xorPad is derived
    // from a random salt and the user's password, and
    // is only used to encrypt the mnemonic (so it won't
    // be reused in any other context).

    const salt = crypto.randomBytes(16)
    const xorPad = crypto.pbkdf2Sync(
      password, salt, 100000, Buffer.byteLength(plaintextNormalized), 'sha512')

    let ciphertext = ''
    for (let i = 0; i < plaintextNormalized.length; i++) {
      const dec = parseInt(plaintextNormalized[i] ^ xorPad[i], 10).toString(16)
      const hex = `00${dec}`.slice(-2)
      ciphertext += hex
    }

    const payloadBuffer = Buffer.concat([salt, Buffer.from(ciphertext, 'hex')])
    return payloadBuffer
  })
}

function decryptMnemonic(dataBuffer: Buffer, password: string) {
  return Promise.resolve().then(() => {
    if (dataBuffer.length !== 112 && dataBuffer.length !== 208) {
      // 16-byte salt, 96-byte or 192-byte key
      throw new Error(`Data buffer must be 112 or 208 bytes (got ${dataBuffer.length})`)
    }
    return dataBuffer
  })
  .then((dataBufferBin) => {
    const salt = dataBufferBin.slice(0, 16)
    const cipherText = dataBufferBin.slice(16)
    const xorPad = crypto.pbkdf2Sync(password, salt, 100000, dataBuffer.length, 'sha512')

    let plaintextHex = ''
    for (let i = 0; i < cipherText.length; i++) {
      const dec = parseInt(cipherText[i] ^ xorPad[i], 10).toString(16)
      const hex = `00${dec}`.slice(-2)
      plaintextHex += hex
    }

    // de-normalize back to mnemonic
    const plaintext = Buffer.from(plaintextHex, 'hex')
      .toString()
      .split(/ +/)
      .filter((word) => word.length > 0)
      .join(' ')

    if (!bip39.validateMnemonic(plaintext)) {
      throw new Error('Password is wrong (not a valid BIP39 mnemonic)')
    }    
    return plaintext
  })
}


export function encrypt(plaintextBuffer, password) {
  return encryptMnemonic(plaintextBuffer, password)
}

export function decrypt(dataBuffer, password) {
  return decryptMnemonic(dataBuffer, password)
  .catch(() => // try the old way
    new Promise((resolve, reject) => {
      triplesec.decrypt(
        {
          key: new Buffer(password),
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
  )
}
*/
