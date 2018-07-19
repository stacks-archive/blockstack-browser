import EncryptWorker from './workers/encrypt.worker'
import DecryptWorker from './workers/decrypt.worker'

function runWorker(WorkerClass, args) {
  return new Promise((resolve, reject) => {
    const worker = new WorkerClass()
    worker.onmessage = ev => {
      if (ev.data.payload) {
        resolve(ev.data.payload)
      }
      else {
        reject(new Error(ev.data.error))
      }
    }
    worker.onerror = err => {
      reject(err)
    }
    worker.postMessage(args)

    // Fallback if worker silently fails (can happen in some browsers)
    setTimeout(() => {
      reject(new Error('Worker timed out'))
    }, 15000)
  })
}

export function encrypt(plaintextBuffer, password) {
  const mnemonic = plaintextBuffer.toString()
  return runWorker(EncryptWorker, { mnemonic, password })
}

export function decrypt(dataBuffer, password) {
  const encryptedMnemonic = dataBuffer.toString('hex')
  return runWorker(DecryptWorker, { encryptedMnemonic, password })
    .then(mnemonic => Buffer.from(mnemonic))
}
