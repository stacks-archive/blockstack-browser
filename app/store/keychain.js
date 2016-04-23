import bip39 from 'bip39'
import { encrypt, decrypt } from '../utils'
import { PrivateKeychain, getEntropy } from 'blockstack-keychains'

const CREATE_WALLET = 'CREATE_WALLET',
      NEW_IDENTITY_ADDRESS = 'NEW_IDENTITY_ADDRESS',
      NEW_BITCOIN_ADDRESS = 'NEW_BITCOIN_ADDRESS',
      UPDATE_BACKUP_PHRASE = 'UPDATE_BACKUP_PHRASE'

function createWallet(encryptedBackupPhrase, identityPublicKeychain, bitcoinPublicKeychain) {
  return {
    type: CREATE_WALLET,
    encryptedBackupPhrase: encryptedBackupPhrase,
    identityPublicKeychain: identityPublicKeychain,
    bitcoinPublicKeychain: bitcoinPublicKeychain
  }
}

function updateBackupPhrase(encryptedBackupPhrase) {
  return {
    type: UPDATE_BACKUP_PHRASE,
    encryptedBackupPhrase: encryptedBackupPhrase
  }
}

function deleteBackupPhrase() {
  return dispatch => {
    dispatch(updateBackupPhrase(null))
  }
}

function initializeWallet(password, backupPhrase) {
  return dispatch => {
    let privateKeychain
    if (backupPhrase && bip39.validateMnemonic(backupPhrase)) {
      privateKeychain = PrivateKeychain.fromMnemonic(backupPhrase)
    } else {
      privateKeychain = new PrivateKeychain()
      backupPhrase = privateKeychain.mnemonic()
    }

    const identityPrivateKeychain = privateKeychain.privatelyNamedChild('blockstack-0'),
          bitcoinPrivateKeychain = privateKeychain.privatelyNamedChild('bitcoin-0')

    const identityPublicKeychain = identityPrivateKeychain.publicKeychain().publicKey('hex'),
          bitcoinPublicKeychain = bitcoinPrivateKeychain.publicKeychain().publicKey('hex')

    encrypt(new Buffer(backupPhrase), password, function(err, ciphertextBuffer) {
      const encryptedBackupPhrase = ciphertextBuffer.toString('hex')
      dispatch(createWallet(encryptedBackupPhrase, identityPublicKeychain, bitcoinPublicKeychain))
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
  updateBackupPhrase: updateBackupPhrase,
  initializeWallet: initializeWallet,
  newIdentityAddress: newIdentityAddress,
  newBitcoinAddress: newBitcoinAddress,
  deleteBackupPhrase: deleteBackupPhrase
}

const initialState = {
  encryptedBackupPhrase: null,
  identityAccounts: [],
  bitcoinAccounts: []
}

export function KeychainReducer(state = initialState, action) {
  switch (action.type) {
    case CREATE_WALLET:
      return Object.assign({}, state, {
        encryptedBackupPhrase: action.encryptedBackupPhrase,
        identityAccounts: [
          {
            accountKeychain: action.identityPublicKeychain,
            addressIndex: 0
          }
        ],
        bitcoinAccounts: [
          {
            accountKeychain: action.bitcoinPublicKeychain,
            addressIndex: 0
          }
        ]
      })
    case UPDATE_BACKUP_PHRASE:
      return Object.assign({}, state, {
        encryptedBackupPhrase: action.encryptedBackupPhrase
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
