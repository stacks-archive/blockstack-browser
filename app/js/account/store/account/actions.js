import { HDNode } from 'bitcoinjs-lib'
import bip39 from 'bip39'
import { randomBytes } from 'crypto'
import { authorizationHeaderValue,
  btcToSatoshis,
  deriveIdentityKeyPair,
  encrypt,
  getIdentityPrivateKeychain,
  getBitcoinPrivateKeychain,
  getIdentityOwnerAddressNode,
  getBitcoinAddressNode } from '../../../utils'
import roundTo from 'round-to'
import * as types from './types'
import log4js from 'log4js'

const logger = log4js.getLogger('account/store/account/actions.js')

function createAccount(encryptedBackupPhrase, masterKeychain) {
  const identityPrivateKeychainNode = getIdentityPrivateKeychain(masterKeychain)
  const bitcoinPrivateKeychainNode = getBitcoinPrivateKeychain(masterKeychain)

  const identityPublicKeychainNode = identityPrivateKeychainNode.neutered()
  const identityPublicKeychain = identityPublicKeychainNode.toBase58()

  const bitcoinPublicKeychainNode = bitcoinPrivateKeychainNode.neutered()
  const bitcoinPublicKeychain = bitcoinPublicKeychainNode.toBase58()

  const firstBitcoinAddress = getBitcoinAddressNode(bitcoinPublicKeychainNode).getAddress()

  const ADDRESSES_TO_GENERATE = 1
  const identityAddresses = []
  const identityKeypairs = []

  // We pre-generate a number of identity addresses so that we
  // don't have to prompt the user for the password on each new profile
  for (let addressIndex = 0; addressIndex < ADDRESSES_TO_GENERATE; addressIndex++) {
    const identityOwnerAddressNode =
    getIdentityOwnerAddressNode(identityPrivateKeychainNode, addressIndex)
    const identityKeyPair = deriveIdentityKeyPair(identityOwnerAddressNode)
    identityKeypairs.push(identityKeyPair)
    identityAddresses.push(identityKeyPair.address)
  }

  return {
    type: types.CREATE_ACCOUNT,
    encryptedBackupPhrase,
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityAddresses,
    identityKeypairs
  }
}

function updateCoreWalletAddress(coreWalletAddress) {
  return {
    type: types.UPDATE_CORE_ADDRESS,
    coreWalletAddress
  }
}

function updateCoreWalletBalance(coreWalletBalance) {
  return {
    type: types.UPDATE_CORE_BALANCE,
    coreWalletBalance
  }
}

function deleteAccount() {
  return {
    type: types.DELETE_ACCOUNT,
    encryptedBackupPhrase: null,
    accountCreated: false
  }
}

function updateBackupPhrase(encryptedBackupPhrase) {
  return {
    type: types.UPDATE_BACKUP_PHRASE,
    encryptedBackupPhrase
  }
}

function updateBalances(balances) {
  return {
    type: types.UPDATE_BALANCES,
    balances
  }
}

function resetCoreBalanceWithdrawal() {
  return {
    type: types.RESET_CORE_BALANCE_WITHDRAWAL
  }
}

function withdrawingCoreBalance(recipientAddress) {
  return {
    type: types.WITHDRAWING_CORE_BALANCE,
    recipientAddress
  }
}

function withdrawCoreBalanceSuccess() {
  return {
    type: types.WITHDRAW_CORE_BALANCE_SUCCESS
  }
}

function withdrawCoreBalanceError(error) {
  return {
    type: types.WITHDRAW_CORE_BALANCE_ERROR,
    error
  }
}

function promptedForEmail() {
  return {
    type: types.PROMPTED_FOR_EMAIL
  }
}

function connectedStorage() {
  return {
    type: types.CONNECTED_STORAGE
  }
}

function updateViewedRecoveryCode() {
  return {
    type: types.VIEWED_RECOVERY_CODE
  }
}

function displayedRecoveryCode() {
  logger.trace('displayedRecoveryCode')
  return dispatch => {
    dispatch(updateViewedRecoveryCode())
  }
}

function emailNotifications(email) {
  logger.debug(`emailNotifications: ${email}`)
  return dispatch => {
    dispatch(promptedForEmail())
    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }

    const requestBody = {
      email
    }

    const options = {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    }
    const emailNotificationsUrl = 'https://blockstack-portal-emailer.appartisan.com/notifications'

    return fetch(emailNotificationsUrl, options)
    .then(() => {
      logger.debug(`emailNotifications: registered ${email} for notifications`)
    }, (error) => {
      logger.error('emailNotifications: error', error)
    }).catch(error => {
      logger.error('emailNotifications: error', error)
    })
  }
}

function skipEmailBackup() {
  logger.trace('skipEmailBackup')
  return dispatch => {
    dispatch(promptedForEmail())
  }
}

function storageIsConnected() {
  logger.trace('storageConnected')
  return dispatch => {
    dispatch(connectedStorage())
  }
}

function refreshCoreWalletBalance(addressBalanceUrl, coreAPIPassword) {
  return dispatch => {
    logger.trace('refreshCoreWalletBalance: Beginning refresh...')
    logger.debug(`refreshCoreWalletBalance: addressBalanceUrl: ${addressBalanceUrl}`)
    const headers = { Authorization: authorizationHeaderValue(coreAPIPassword) }
    fetch(addressBalanceUrl, { headers })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const balance = responseJson.balance.bitcoin
      logger.debug(`refreshCoreWalletBalance: balance is ${balance}.`)
      dispatch(
        updateCoreWalletBalance(balance)
      )
    })
    .catch((error) => {
      logger.error('refreshCoreWalletBalance: error refreshing balance', error)
    })
  }
}

function getCoreWalletAddress(walletPaymentAddressUrl, coreAPIPassword) {
  return dispatch => {
    const headers = { 'Authorization': authorizationHeaderValue(coreAPIPassword) }
    fetch(walletPaymentAddressUrl, { headers })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      const address = responseJson.address
      dispatch(
        updateCoreWalletAddress(address)
      )
    }).catch((error) => {
      logger.error('getCoreWalletAddress: error fetching address', error)
    })
  }
}

function resetCoreWithdrawal() {
  return dispatch => {
    dispatch(resetCoreBalanceWithdrawal())
  }
}

function withdrawBitcoinFromCoreWallet(coreWalletWithdrawUrl, recipientAddress, coreAPIPassword) {
  return dispatch => {
    dispatch(withdrawingCoreBalance(recipientAddress, 1))

    logger.debug(`withdrawBitcoinFromCoreWallet: send all money to ${recipientAddress}`)

    const requestHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authorizationHeaderValue(coreAPIPassword)
    }

    const requestBody = JSON.stringify({
      address: recipientAddress,
      min_confs: 0
    })

    fetch(coreWalletWithdrawUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: requestBody
    })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      if (responseJson['error']) {
        dispatch(withdrawCoreBalanceError(responseJson['error']))
      } else {
        dispatch(withdrawCoreBalanceSuccess())
      }
    })
    .catch((error) => {
      logger.error('withdrawBitcoinFromCoreWallet:', error)
      dispatch(withdrawCoreBalanceError(error))
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
          address,
          balance: responseJson['balance']
        })

        if (results.length >= addresses.length) {
          let balances = {}
          let total = 0.0

          for (let i = 0; i < results.length; i++) {
            let address = results[i]['address']
            if (!balances.hasOwnProperty(address)) {
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
    .catch((error) => {
      logger.error('refreshBalances: error', error)
    })
  }
}

function initializeWallet(password, backupPhrase, email = null) {
  return dispatch => {
    let masterKeychain = null
    if (backupPhrase && bip39.validateMnemonic(backupPhrase)) {
      const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
      masterKeychain = HDNode.fromSeedBuffer(seedBuffer)
    } else { // Create a new wallet
      const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
      backupPhrase = bip39.generateMnemonic(STRENGTH, randomBytes)
      const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
      masterKeychain = HDNode.fromSeedBuffer(seedBuffer)
    }
    return encrypt(new Buffer(backupPhrase), password).then((ciphertextBuffer) => {
      const encryptedBackupPhrase = ciphertextBuffer.toString('hex')
      dispatch(
        createAccount(encryptedBackupPhrase, masterKeychain, email)
      )
    })
  }
}

function newBitcoinAddress() {
  return {
    type: types.NEW_BITCOIN_ADDRESS
  }
}


function newIdentityAddress(newIdentityKeypair) {
  return {
    type: types.NEW_IDENTITY_ADDRESS,
    keypair: newIdentityKeypair
  }
}

function incrementIdentityAddressIndex() {
  return {
    type: types.INCREMENT_IDENTITY_ADDRESS_INDEX
  }
}

function usedIdentityAddress() {
  logger.trace('usedIdentityAddress')
  return dispatch => {
    dispatch(incrementIdentityAddressIndex())
  }
}

const AccountActions = {
  createAccount,
  updateBackupPhrase,
  initializeWallet,
  newBitcoinAddress,
  deleteAccount,
  refreshBalances,
  getCoreWalletAddress,
  refreshCoreWalletBalance,
  resetCoreWithdrawal,
  withdrawBitcoinFromCoreWallet,
  emailNotifications,
  skipEmailBackup,
  storageIsConnected,
  updateViewedRecoveryCode,
  incrementIdentityAddressIndex,
  usedIdentityAddress,
  displayedRecoveryCode,
  newIdentityAddress
}

export default AccountActions
