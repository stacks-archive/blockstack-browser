import bip39 from 'bip39'
import { encrypt, decrypt, decryptPrivateKeychain, getIdentityPrivateKeychain, getBitcoinPrivateKeychain } from '../utils'
import { PrivateKeychain, PublicKeychain, getEntropy } from 'blockstack-keychains'
import { ECPair } from 'bitcoinjs-lib'
import { authorizationHeaderValue } from '../utils'

const CREATE_ACCOUNT = 'CREATE_ACCOUNT',
      DELETE_ACCOUNT = 'DELETE_ACCOUNT',
      NEW_IDENTITY_ADDRESS = 'NEW_IDENTITY_ADDRESS',
      NEW_BITCOIN_ADDRESS = 'NEW_BITCOIN_ADDRESS',
      UPDATE_BACKUP_PHRASE = 'UPDATE_BACKUP_PHRASE',
      UPDATE_BALANCES = 'UPDATE_BALANCES',
      UPDATE_CORE_ADDRESS = 'UPDATE_CORE_ADDRESS',
      UPDATE_CORE_BALANCE = 'UPDATE_CORE_BALANCE'

function createAccount(encryptedBackupPhrase, privateKeychain, email=null) {
  const identityPrivateKeychain = getIdentityPrivateKeychain(privateKeychain)
  const bitcoinPrivateKeychain = getBitcoinPrivateKeychain(privateKeychain)

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

function updateCoreWalletAddress(coreWalletAddress) {
  return {
    type: UPDATE_CORE_ADDRESS,
    coreWalletAddress: coreWalletAddress
  }
}

function updateCoreWalletBalance(coreWalletBalance) {
  return {
    type: UPDATE_CORE_BALANCE,
    coreWalletBalance: coreWalletBalance
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

function updateBalances(balances) {
  return {
    type: UPDATE_BALANCES,
    balances: balances
  }
}

function refreshCoreWalletBalance(addressBalanceUrl, coreWalletAddress) {
  return dispatch => {
    const url = addressBalanceUrl.replace('{address}', coreWalletAddress)
    fetch(url)
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const balance = responseJson.unconfirmedBalance + responseJson.balance
      dispatch(
        updateCoreWalletBalance(balance)
      )
    })
  }
}

function getCoreWalletAddress(walletPaymentAddressUrl) {
  return dispatch => {
    const headers = {"Authorization": authorizationHeaderValue() }
    fetch(walletPaymentAddressUrl, { headers: headers })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const address = responseJson.address
      dispatch(
        updateCoreWalletAddress(address)
      )
    })
  }
}

function refreshBalances(addressBalanceUrl, addresses) {
  return dispatch => {
    let results = []
    addresses.forEach((address) => {

      // fetch balances from https://explorer.blockstack.org/insight-api/addr/{address}/?noTxList=1
      // parse results from: {"addrStr":"1Fvoya7XMvzfpioQnzaskndL7YigwHDnRE","balance":0.02431567,"balanceSat":2431567,"totalReceived":38.82799913,"totalReceivedSat":3882799913,"totalSent":38.80368346,"totalSentSat":3880368346,"unconfirmedBalance":0,"unconfirmedBalanceSat":0,"unconfirmedTxApperances":0,"txApperances":2181}
      const url = addressBalanceUrl.replace('{address}', address)
      fetch(url).then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {

        results.push({
          address: address,
          balance: responseJson['balance']
        })

        if(results.length >= addresses.length) {
          let balances = {}
          let total = 0.0

          for(let i = 0; i < results.length; i++) {
            let address = results[i]['address']
            if(!balances.hasOwnProperty(address)) {
              let balance = results[i]['balance']
              total = total + balance
              balances[address] = balance
            } else {
              console.warn(`Duplicate address ${address} in addresses array`)
            }

          }

          balances['total'] = total

          dispatch(
            updateBalances(balances)
          )
        }
      })
    })
  }
}

function initializeWallet(password, backupPhrase, email=null) {
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
  deleteAccount: deleteAccount,
  refreshBalances: refreshBalances,
  getCoreWalletAddress: getCoreWalletAddress,
  refreshCoreWalletBalance: refreshCoreWalletBalance
}

const initialState = {
  accountCreated: false,
  encryptedBackupPhrase: null,
  identityAccount: {
    addresses: [],
    keypairs: []
  },
  bitcoinAccount: {
    addresses: [],
    balances: { total: 0.0 }
  },
  analyticsId: '',
  coreWalletAddress: null,
  coreWalletBalance: 0.0
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
            action.firstIdentityAddress
          ],
          keypairs: [
            { key: action.firstIdentityKey,
              keyID: action.firstIdentityKeyID,
              address: action.firstIdentityAddress }
          ],
          addressIndex: 0
        },
        bitcoinAccount: {
          publicKeychain: action.bitcoinPublicKeychain,
          addresses: [
            action.firstBitcoinAddress
          ],
          addressIndex: 0,
          balances: state.bitcoinAccount.balances
        },
        analyticsId: action.analyticsId
      })
    case DELETE_ACCOUNT:
      return Object.assign({}, state, {
        accountCreated: false,
        encryptedBackupPhrase: null
      })
    case UPDATE_CORE_ADDRESS:
      return Object.assign({}, state, {
        coreWalletAddress: action.coreWalletAddress
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
          addressIndex: state.bitcoinAccount.addressIndex + 1,
          balances: state.bitcoinAccount.balances
        }
      })
    case UPDATE_BALANCES:
    return Object.assign({}, state, {
      bitcoinAccount: {
        publicKeychain: state.bitcoinAccount.publicKeychain,
        addresses: state.bitcoinAccount.addresses,
        balances: action.balances
      }
    })
    default:
      return state
  }
}
