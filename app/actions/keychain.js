import Mnemonic from 'bitcore-mnemonic'
delete global._bitcore
import { encrypt, decrypt } from '../utils/keychain-utils'

export const CREATE_WALLET = 'CREATE_WALLET'
export const CREATE_ACCOUNT = 'CREATE_ACCOUNT'
export const GENERATE_ADDRESS = 'GENERATE_ADDRESS'

export function createWallet(encryptedMnemonic) {
  return {
    type: CREATE_WALLET,
    encryptedMnemonic: encryptedMnemonic
  }
}

export function initializeWallet(password) {
  return dispatch => {
    const mnemonic = new Mnemonic(160, Mnemonic.Words.ENGLISH).toString()
    encrypt(new Buffer(mnemonic), password, function(err, ciphertext) {
      const encryptedMnemonic = ciphertext.toString('hex')
      dispatch(createWallet(encryptedMnemonic))
    })
  }
}

export function createAccount() {
  return {
    type: CREATE_ACCOUNT
  }
}

export function generateAddress() {
  return {
    type: GENERATE_ADDRESS,
    path: path
  }
}
