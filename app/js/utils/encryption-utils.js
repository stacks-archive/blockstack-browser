import encryptWorker from 'workerize-loader!./workers/encrypt'
import decryptWorker from 'workerize-loader!./workers/decrypt'

export function encrypt(plaintextBuffer, password) {
  const mnemonic = plaintextBuffer.toString()
  return encryptWorker(mnemonic, password)
}

export function decrypt(dataBuffer, password) {
  const encryptedMnemonic = dataBuffer.toString('hex')
  console.log('Decrypting!', encryptedMnemonic, password)
  console.log(decryptWorker)
  return decryptWorker(encryptedMnemonic, password)
    .then(mnemonic => Buffer.from(mnemonic))
}
