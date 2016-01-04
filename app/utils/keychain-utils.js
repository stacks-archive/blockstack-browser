import Mnemonic from 'bitcore-mnemonic'
import triplesec from 'triplesec'

export function getPrivateKeychainFromMnemonic(words) {
  var mnemonic = new Mnemonic(words)
  var privateKeychain = mnemonic.toHDPrivateKey()
  return privateKeychain
}

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
    }, function(err, plaintext) {
        callback(err, plaintext)
    })
}