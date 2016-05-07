import triplesec from 'triplesec'

export function encrypt(plaintextBuffer, password, callback) {
  triplesec.encrypt({
    key: new Buffer(password),
    data: plaintextBuffer
  }, function(err, ciphertext) {
    callback(err, ciphertext)
  })
}

export function decrypt(dataBuffer, password, callback) {
  triplesec.decrypt({
    key: new Buffer(password),
    data: dataBuffer
  }, function(err, plaintextBuffer) {
    callback(err, plaintextBuffer)
  })
}