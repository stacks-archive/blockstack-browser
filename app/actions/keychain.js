import Mnemonic from 'bitcore-mnemonic'; delete global._bitcore
import {
  encrypt, decrypt, derivePrivateKeychain, derivePublicKeychain,
  getAccountPrivateKeychain
} from '../utils/keychain-utils'

export const CREATE_WALLET = 'CREATE_WALLET'
export const NEW_IDENTITY_ADDRESS = 'NEW_IDENTITY_ADDRESS'
export const NEW_BITCOIN_ADDRESS = 'NEW_BITCOIN_ADDRESS'

export function createWallet(encryptedMnemonic, identityPublicKeychain, bitcoinPublicKeychain) {
  return {
    type: CREATE_WALLET,
    encryptedMnemonic: encryptedMnemonic,
    identityPublicKeychain: identityPublicKeychain,
    bitcoinPublicKeychain: bitcoinPublicKeychain
  }
}

export function initializeWallet(password) {
  return dispatch => {
    const mnemonic = new Mnemonic(160, Mnemonic.Words.ENGLISH).toString()

    const masterPrivateKeychain = derivePrivateKeychain(mnemonic)

    const identityPublicKeychain = getAccountPrivateKeychain(
      masterPrivateKeychain, 'blockstore', 0).publicKeychain()
    const bitcoinPublicKeychain = getAccountPrivateKeychain(
      masterPrivateKeychain, 'bitcoin', 0).publicKeychain()

    encrypt(new Buffer(mnemonic), password, function(err, ciphertext) {
      const encryptedMnemonic = ciphertext.toString('hex')
      dispatch(createWallet(encryptedMnemonic, identityPublicKeychain, bitcoinPublicKeychain))
    })
  }
}

export function newIdentityAddress(accountIndex = 0) {
  return {
    type: NEW_IDENTITY_ADDRESS,
    accountIndex: accountIndex
  }
}

export function newBitcoinAddress(accountIndex = 0) {
  return {
    type: NEW_BITCOIN_ADDRESS,
    accountIndex: accountIndex
  }
}

