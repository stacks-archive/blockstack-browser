import {
  CREATE_WALLET, NEW_IDENTITY_ADDRESS, NEW_BITCOIN_ADDRESS, UPDATE_MNEMONIC
} from '../actions/keychain'
import { getAccountPrivateKeychain } from '../utils/keychain-utils'
import { PrivateKeychain } from 'keychain-manager'; delete global._bitcore

const initialState = {
  encryptedMnemonic: null,
  identityAccounts: [],
  bitcoinAccounts: []
}

function createNewAccount(publicKeychain) {
  const publicKeychainString = publicKeychain.toString()
  return {
    accountKeychain: publicKeychainString,
    addressIndex: 0
  }
}

export default function Keychain(state = initialState, action) {
  switch (action.type) {
    case CREATE_WALLET:
      return Object.assign({}, state, {
        encryptedMnemonic: action.encryptedMnemonic,
        identityAccounts: [
          createNewAccount(action.identityPublicKeychain)
        ],
        bitcoinAccounts: [
          createNewAccount(action.bitcoinPublicKeychain)
        ]
      })
    case UPDATE_MNEMONIC:
      return Object.assign({}, state, {
        encryptedMnemonic: action.encryptedMnemonic
      })
    case NEW_IDENTITY_ADDRESS:
      return Object.assign({}, state, {
        identityAccounts: [
          ...state.identityAccounts.slice(0, action.accountIndex),
          Object.assign({}, state.identityAccounts[action.accountIndex], {
            addressIndex: state.identityAccounts[action.accountIndex].addressIndex + 1
          }),
          ...state.identityAccounts.slice(action.accountIndex + 1)
        ]
      })
    case NEW_BITCOIN_ADDRESS:
      return Object.assign({}, state, {
        bitcoinAccounts: [
          ...state.bitcoinAccounts.slice(0, action.accountIndex),
          Object.assign({}, state.bitcoinAccounts[action.accountIndex], {
            addressIndex: state.bitcoinAccounts[action.accountIndex].addressIndex + 1
          }),
          ...state.bitcoinAccounts.slice(action.accountIndex + 1)
        ]
      })
    default:
      return state
  }
}
