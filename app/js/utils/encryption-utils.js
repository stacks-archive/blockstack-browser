import makeEncryptWorker from './workers/encrypt.worker.js'
import makeDecryptWorker from './workers/decrypt.worker.js'

export function encrypt(plaintextBuffer, password) {
  const mnemonic = plaintextBuffer.toString()
  const encryptWorker = makeEncryptWorker()
  return encryptWorker.encrypt(mnemonic, password)
}

export function decrypt(dataBuffer, password) {
  const encryptedMnemonic = dataBuffer.toString('hex')
  const decryptWorker = makeDecryptWorker()
  return decryptWorker.decrypt(encryptedMnemonic, password)
    .then(mnemonic => Buffer.from(mnemonic))
}
