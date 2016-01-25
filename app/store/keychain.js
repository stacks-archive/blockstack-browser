import Mnemonic from 'bitcore-mnemonic'; delete global._bitcore
import {
  encrypt, decrypt, derivePrivateKeychain, derivePublicKeychain,
  getAccountPrivateKeychain
} from '../utils/keychain-utils'
import { PrivateKeychain } from 'keychain-manager'; delete global._bitcore

const BITS_OF_ENTROPY_FOR_MNEMONIC = 160
const CREATE_WALLET = 'CREATE_WALLET',
      NEW_IDENTITY_ADDRESS = 'NEW_IDENTITY_ADDRESS',
      NEW_BITCOIN_ADDRESS = 'NEW_BITCOIN_ADDRESS',
      UPDATE_MNEMONIC = 'UPDATE_MNEMONIC'

function createWallet(encryptedMnemonic, identityPublicKeychain, bitcoinPublicKeychain) {
  return {
    type: CREATE_WALLET,
    encryptedMnemonic: encryptedMnemonic,
    identityPublicKeychain: identityPublicKeychain,
    bitcoinPublicKeychain: bitcoinPublicKeychain
  }
}

function updateMnemonic(encryptedMnemonic) {
  return {
    type: UPDATE_MNEMONIC,
    encryptedMnemonic: encryptedMnemonic
  }
}

function initializeWallet(password, backupPhrase) {
  return dispatch => {
    let mnemonic
    if (backupPhrase && Mnemonic.isValid(backupPhrase)) {
      mnemonic = backupPhrase
    } else {
      mnemonic = new Mnemonic(BITS_OF_ENTROPY_FOR_MNEMONIC, Mnemonic.Words.ENGLISH).toString()
    }

    const masterPrivateKeychain = derivePrivateKeychain(mnemonic)

    const identityPublicKeychain = getAccountPrivateKeychain(
      masterPrivateKeychain, 'blockstore', 0).publicKeychain()
    const bitcoinPublicKeychain = getAccountPrivateKeychain(
      masterPrivateKeychain, 'bitcoin', 0).publicKeychain()

    encrypt(new Buffer(mnemonic), password, function(err, ciphertextBuffer) {
      const encryptedMnemonic = ciphertextBuffer.toString('hex')
      dispatch(createWallet(encryptedMnemonic, identityPublicKeychain, bitcoinPublicKeychain))
    })
  }
}

function newIdentityAddress(accountIndex = 0) {
  return {
    type: NEW_IDENTITY_ADDRESS,
    accountIndex: accountIndex
  }
}

function newBitcoinAddress(accountIndex = 0) {
  return {
    type: NEW_BITCOIN_ADDRESS,
    accountIndex: accountIndex
  }
}

export const KeychainActions = {
  createWallet: createWallet,
  updateMnemonic: updateMnemonic,
  initializeWallet: initializeWallet,
  newIdentityAddress: newIdentityAddress,
  newBitcoinAddress: newBitcoinAddress
}

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

export function KeychainReducer(state = initialState, action) {
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
