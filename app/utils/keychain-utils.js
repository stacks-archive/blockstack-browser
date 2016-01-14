import Mnemonic from 'bitcore-mnemonic'; delete global._bitcore
import triplesec from 'triplesec'
import { PrivateKeychain } from 'keychain-manager'; delete global._bitcore

const BIP44PurposeNumber = 44
const BIP44BlockstoreCoinTypeNumber = 96
const BIP44BitcoinCoinTypeNumber = 0

export function derivePrivateKeychain(words) {
  const mnemonic = new Mnemonic(words),
        hdPrivateKey = mnemonic.toHDPrivateKey(),
        privateKeychain = new PrivateKeychain(hdPrivateKey)
  return privateKeychain
}

export function getCoinTypeNumber(accountType) {
  switch(accountType) {
    case 'blockstore':
      return BIP44BlockstoreCoinTypeNumber
    case 'bitcoin':
      return BIP44BitcoinCoinTypeNumber
    default:
      return BIP44BitcoinCoinTypeNumber
  }
}

export function getAccountPrivateKeychain(masterPrivateKeychain, accountType, accountNumber=0) {
  const bip44Keychain = masterPrivateKeychain.account(BIP44PurposeNumber),
        branchKeychain = bip44Keychain.account(getCoinTypeNumber(accountType)),
        accountKeychain = branchKeychain.account(accountNumber)
  return accountKeychain
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