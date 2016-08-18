import bip39 from 'bip39'
import { encrypt, decrypt } from '../utils'
import { PrivateKeychain, PublicKeychain, getEntropy } from 'blockstack-keychains'
import { ECPair } from 'bitcoinjs-lib'

const CREATE_ACCOUNT = 'CREATE_ACCOUNT',
      DELETE_ACCOUNT = 'DELETE_ACCOUNT',
      NEW_IDENTITY_ADDRESS = 'NEW_IDENTITY_ADDRESS',
      NEW_BITCOIN_ADDRESS = 'NEW_BITCOIN_ADDRESS',
      UPDATE_BACKUP_PHRASE = 'UPDATE_BACKUP_PHRASE'

function createAccount(encryptedBackupPhrase, privateKeychain, email=null) {
  const identityPrivateKeychain = privateKeychain.privatelyNamedChild('blockstack-0')
  const bitcoinPrivateKeychain = privateKeychain.privatelyNamedChild('bitcoin-0')

  const identityPublicKeychain = identityPrivateKeychain.ecPair.getPublicKeyBuffer().toString('hex')
  const bitcoinPublicKeychain = bitcoinPrivateKeychain.ecPair.getPublicKeyBuffer().toString('hex')
  const firstIdentityAddress = identityPrivateKeychain.ecPair.getAddress()
  const firstBitcoinAddress = bitcoinPrivateKeychain.ecPair.getAddress()

  const firstIdentityKey = identityPrivateKeychain.ecPair.d.toBuffer(32).toString('hex')
  const firstIdentityKeyID = identityPrivateKeychain.ecPair.getPublicKeyBuffer().toString('hex')

  let analyticsId = identityPublicKeychain
  if (email) {
    analyticsId = email
  }
  mixpanel.track('Create account', { distinct_id: analyticsId })
  mixpanel.track('Perform action', { distinct_id: analyticsId })

  return {
    type: CREATE_ACCOUNT,
    encryptedBackupPhrase: encryptedBackupPhrase,
    identityPublicKeychain: identityPublicKeychain,
    bitcoinPublicKeychain: bitcoinPublicKeychain,
    firstIdentityAddress: firstIdentityAddress,
    firstBitcoinAddress: firstBitcoinAddress,
    firstIdentityKey: firstIdentityKey,
    firstIdentityKeyID: firstIdentityKeyID,
    analyticsId: analyticsId
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

function initializeWallet(password, backupPhrase, email) {
  return dispatch => {
    let privateKeychain
    if (backupPhrase && bip39.validateMnemonic(backupPhrase)) {
      privateKeychain = PrivateKeychain.fromMnemonic(backupPhrase)
    } else {
      privateKeychain = new PrivateKeychain()
      backupPhrase = privateKeychain.mnemonic()
    }

    encrypt(new Buffer(backupPhrase), password, function(err, ciphertextBuffer) {
      const encryptedBackupPhrase = ciphertextBuffer.toString('hex')
      dispatch(
        createAccount(encryptedBackupPhrase, privateKeychain, email)
      )
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
    addresses: [],
    keypairs: []
  },
  bitcoinAccount: {
    addresses: []
  },
  analyticsId: ''
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
          keypairs: [
            ...state.identityAccount.keypairs,
            { key: action.firstIdentityKey,
              keyID: action.firstIdentityKeyID,
              address: action.firstIdentityAddress }
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
        },
        analyticsId: action.analyticsId
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
