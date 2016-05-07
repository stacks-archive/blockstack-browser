import bip39 from 'bip39'
import { encrypt, decrypt } from '../utils'
import { PrivateKeychain, PublicKeychain, getEntropy } from 'blockstack-keychains'

const CREATE_ACCOUNT = 'CREATE_ACCOUNT',
      DELETE_ACCOUNT = 'DELETE_ACCOUNT',
      NEW_IDENTITY_ADDRESS = 'NEW_IDENTITY_ADDRESS',
      NEW_BITCOIN_ADDRESS = 'NEW_BITCOIN_ADDRESS',
      UPDATE_BACKUP_PHRASE = 'UPDATE_BACKUP_PHRASE'

function createAccount(encryptedBackupPhrase, identityPublicKeychainString, bitcoinPublicKeychainString) {
  const identityPublicKeychain = new PublicKeychain(identityPublicKeychainString),
        bitcoinPublicKeychain = new PublicKeychain(bitcoinPublicKeychainString),
        firstIdentityAddress = identityPublicKeychain.publiclyEnumeratedChild(0).address().toString(),
        firstBitcoinAddress = bitcoinPublicKeychain.publiclyEnumeratedChild(0).address().toString()

  return {
    type: CREATE_ACCOUNT,
    encryptedBackupPhrase: encryptedBackupPhrase,
    identityPublicKeychain: identityPublicKeychain.publicKey('hex'),
    bitcoinPublicKeychain: bitcoinPublicKeychain.publicKey('hex'),
    firstIdentityAddress: firstIdentityAddress,
    firstBitcoinAddress: firstBitcoinAddress
  }
}

function deleteAccount() {
  return {
    type: DELETE_ACCOUNT,
    encryptedBackupPhrase: null,
    accountCreated: false
  }
}

function updateBackupPhrase(encryptedBackupPhrase) {
  return {
    type: UPDATE_BACKUP_PHRASE,
    encryptedBackupPhrase: encryptedBackupPhrase
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
      dispatch(createAccount(encryptedBackupPhrase, identityPublicKeychain, bitcoinPublicKeychain))
    })
  }
}

function newIdentityAddress() {
  return {
    type: NEW_IDENTITY_ADDRESS
  }
}

function newBitcoinAddress() {
  return {
    type: NEW_BITCOIN_ADDRESS
  }
}

export const AccountActions = {
  createAccount: createAccount,
  updateBackupPhrase: updateBackupPhrase,
  initializeWallet: initializeWallet,
  newIdentityAddress: newIdentityAddress,
  newBitcoinAddress: newBitcoinAddress,
  deleteAccount: deleteAccount
}

const initialState = {
  accountCreated: false,
  encryptedBackupPhrase: null,
  identityAccount: {
    addresses: []
  },
  bitcoinAccount: {
    addresses: []
  }
}

export function AccountReducer(state=initialState, action) {
  switch (action.type) {
    case CREATE_ACCOUNT:
      return Object.assign({}, state, {
        accountCreated: true,
        encryptedBackupPhrase: action.encryptedBackupPhrase,
        identityAccount: {
          publicKeychain: action.identityPublicKeychain,
          addresses: [
            ...state.identityAccount.addresses,
            action.firstIdentityAddress
          ],
          addressIndex: 0
        },
        bitcoinAccount: {
          publicKeychain: action.bitcoinPublicKeychain,
          addresses: [
            ...state.bitcoinAccount.addresses,
            action.firstBitcoinAddress
          ],
          addressIndex: 0
        }
      })
    case DELETE_ACCOUNT:
      return Object.assign({}, state, {
        accountCreated: false,
        encryptedBackupPhrase: null
      })
    case UPDATE_BACKUP_PHRASE:
      return Object.assign({}, state, {
        encryptedBackupPhrase: action.encryptedBackupPhrase
      })
    case NEW_IDENTITY_ADDRESS:
      return Object.assign({}, state, {
        identityAccount: {
          publicKeychain: state.identityAccount.publicKeychain,
          addresses: [
            ...state.identityAccount.addresses,
            new PublicKeychain(state.identityAccount.publicKeychain)
              .publiclyEnumeratedChild(state.identityAccount.addressIndex + 1)
              .address().toString()
          ],
          addressIndex: state.identityAccount.addressIndex + 1
        }
      })
    case NEW_BITCOIN_ADDRESS:
      return Object.assign({}, state, {
        bitcoinAccount: {
          publicKeychain: state.bitcoinAccount.publicKeychain,
          addresses: [
            ...state.bitcoinAccount.addresses,
            new PublicKeychain(state.bitcoinAccount.publicKeychain)
              .publiclyEnumeratedChild(state.bitcoinAccount.addressIndex + 1)
              .address().toString()
          ],
          addressIndex: state.bitcoinAccount.addressIndex + 1
        }
      })
    default:
      return state
  }
}
