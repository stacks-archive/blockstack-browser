import triplesec from 'triplesec'

export function encrypt(plaintextBuffer, password) {
  return new Promise((resolve, reject) => {
    triplesec.encrypt({
      key: new Buffer(password),
      data: plaintextBuffer
    }, (err, ciphertext) => {
      if (!err) {
        resolve(ciphertext)
      } else {
        reject(err)
      }
    })
  })
}

export function decrypt(dataBuffer, password) {
  return new Promise((resolve, reject) => {
    triplesec.decrypt({
      key: new Buffer(password),
      data: dataBuffer
    }, (err, plaintextBuffer) => {
      if (!err) {
        resolve(plaintextBuffer)
      } else {
        reject(err)
      }
    })
  })
}
