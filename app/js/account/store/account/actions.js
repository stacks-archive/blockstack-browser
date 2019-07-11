import { HDNode } from 'bitcoinjs-lib'

import { randomBytes } from 'crypto'
import {
  authorizationHeaderValue,
  btcToSatoshis,
  satoshisToBtc,
  encrypt,
  getInsightUrls,
  getBlockchainIdentities
} from '@utils'
import { isCoreEndpointDisabled } from '@utils/window-utils'
import { transactions, config, network } from 'blockstack'
import { fetchIdentitySettings } from '../../../account/utils'
import roundTo from 'round-to'
import * as types from './types'
import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

const doVerifyRecoveryCode = () => dispatch =>
  dispatch({
    type: types.RECOVERY_CODE_VERIFIED
  })

const updateEmail = email => dispatch =>
  dispatch({
    type: types.UPDATE_EMAIL_ADDRESS,
    email
  })

function createAccount(
  encryptedBackupPhrase,
  masterKeychain,
  identitiesToGenerate
) {
  logger.debug(`createAccount: identitiesToGenerate: ${identitiesToGenerate}`)

  const {
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityAddresses,
    identityKeypairs,
    identitySettings
  } = getBlockchainIdentities(masterKeychain, identitiesToGenerate)

  return {
    type: types.CREATE_ACCOUNT,
    encryptedBackupPhrase,
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityAddresses,
    identityKeypairs,
    identitySettings
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

function buildTransaction(recipientAddress) {
  return {
    type: types.BUILD_TRANSACTION,
    payload: recipientAddress
  }
}

function buildTransactionSuccess(txHex) {
  return {
    type: types.BUILD_TRANSACTION_SUCCESS,
    payload: txHex
  }
}

function buildTransactionError(error) {
  return {
    type: types.BUILD_TRANSACTION_ERROR,
    payload: error
  }
}

function broadcastTransaction(txHex) {
  return {
    type: types.BROADCAST_TRANSACTION,
    payload: txHex
  }
}

function broadcastTransactionSuccess(txId) {
  return {
    type: types.BROADCAST_TRANSACTION_SUCCESS,
    payload: txId
  }
}

function broadcastTransactionError(error) {
  return {
    type: types.BROADCAST_TRANSACTION_ERROR,
    payload: error
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

function promptedForEmail(email = null) {
  return {
    type: types.PROMPTED_FOR_EMAIL,
    email
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
  logger.info('displayedRecoveryCode')
  return dispatch => {
    dispatch(updateViewedRecoveryCode())
  }
}

function emailNotifications(email, optIn) {
  logger.debug(`emailNotifications: ${email}`)
  return dispatch => {
    dispatch(promptedForEmail(email))

    const options = {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    const url = `
      https://blockstack-portal-emailer.appartisan.com/notifications?mailingListOptIn=${
        optIn ? 'true' : 'false'
      }
    `

    return fetch(url, options)
      .then(
        () => {
          logger.debug(
            `emailNotifications: registered ${email} for notifications`
          )
        },
        error => {
          logger.error('emailNotifications: error', error)
        }
      )
      .catch(error => {
        logger.error('emailNotifications: error', error)
      })
  }
}

function skipEmailBackup() {
  logger.info('skipEmailBackup')
  return dispatch => {
    dispatch(promptedForEmail())
  }
}

function storageIsConnected() {
  logger.info('storageConnected')
  return dispatch => {
    dispatch(connectedStorage())
  }
}

function refreshCoreWalletBalance(addressBalanceUrl, coreAPIPassword) {
  return dispatch => {
    if (isCoreEndpointDisabled(addressBalanceUrl)) {
      logger.debug('Mocking core wallet balance in webapp build')
      dispatch(updateCoreWalletBalance(0))
      return Promise.resolve()
    }

    logger.info('refreshCoreWalletBalance: Beginning refresh...')
    logger.debug(
      `refreshCoreWalletBalance: addressBalanceUrl: ${addressBalanceUrl}`
    )
    const headers = { Authorization: authorizationHeaderValue(coreAPIPassword) }
    return fetch(addressBalanceUrl, { headers })
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        const balance = responseJson.balance.bitcoin
        logger.debug(`refreshCoreWalletBalance: balance is ${balance}.`)
        dispatch(updateCoreWalletBalance(balance))
      })
      .catch(error => {
        logger.error(
          'refreshCoreWalletBalance: error refreshing balance',
          error
        )
      })
  }
}

function getCoreWalletAddress(walletPaymentAddressUrl, coreAPIPassword) {
  return dispatch => {
    if (isCoreEndpointDisabled(walletPaymentAddressUrl)) {
      logger.error('Cannot use core wallet if core is disable')
      return Promise.resolve()
    }

    const headers = { Authorization: authorizationHeaderValue(coreAPIPassword) }
    return fetch(walletPaymentAddressUrl, { headers })
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        const address = responseJson.address
        dispatch(updateCoreWalletAddress(address))
      })
      .catch(error => {
        logger.error('getCoreWalletAddress: error fetching address', error)
      })
  }
}

function resetCoreWithdrawal() {
  return dispatch => {
    dispatch(resetCoreBalanceWithdrawal())
  }
}

function buildBitcoinTransaction(
  regTestMode,
  paymentKey,
  recipientAddress,
  amountBTC
) {
  return dispatch => {
    logger.info('Building bitcoin transaction')
    dispatch(buildTransaction(recipientAddress))

    if (regTestMode) {
      logger.info('Changing recipient address to regtest address')
      config.network = network.defaults.LOCAL_REGTEST
      config.network.blockstackAPIUrl = 'http://localhost:6270'
      recipientAddress = config.network.coerceAddress(recipientAddress)
    }
    const amountSatoshis = Math.floor(amountBTC * 1e8)

    logger.debug(
      `Building transaction to send ${amountSatoshis} satoshis to ${recipientAddress}`
    )
    return transactions
      .makeBitcoinSpend(recipientAddress, paymentKey, amountSatoshis)
      .then(txHex => {
        logger.info('Succesfully built bitcoin transaction')
        dispatch(buildTransactionSuccess(txHex))
      })
      .catch(err => {
        logger.error(`Failed to build bitcoin transaction: ${err}`)
        dispatch(buildTransactionError(err.message || err.toString()))
      })
  }
}

function broadcastBitcoinTransaction(regTestMode, txHex) {
  return dispatch => {
    logger.info('Broadcasting bitcoin transaction')
    logger.debug('Transaction hex:', txHex)
    dispatch(broadcastTransaction())

    if (regTestMode) {
      logger.info('Using regtest network to broadcast transaction')
      config.network = network.defaults.LOCAL_REGTEST
      config.network.blockstackAPIUrl = 'http://localhost:6270'
    }

    return config.network
      .broadcastTransaction(txHex)
      .then(res => {
        logger.info(`Broadcasting bitcoin transaction succesful: ${res}`)
        dispatch(broadcastTransactionSuccess())
      })
      .catch(err => {
        logger.error(`Failed to broadcast bitcoin transaction: ${err}`)
        dispatch(broadcastTransactionError(err.message || err.toString()))
      })
  }
}

function withdrawBitcoinFromCoreWallet(
  coreWalletWithdrawUrl,
  recipientAddress,
  coreAPIPassword,
  amount = null,
  paymentKey = null
) {
  return dispatch => {
    if (isCoreEndpointDisabled(coreWalletWithdrawUrl)) {
      dispatch(
        withdrawCoreBalanceError(
          'Core wallet withdrawls not allowed in the simple webapp build'
        )
      )
      return Promise.resolve()
    }

    const requestBody = {
      address: recipientAddress,
      min_confs: 0
    }

    if (amount !== null) {
      const satoshisAmount = btcToSatoshis(amount)
      const roundedSatoshiAmount = roundTo(satoshisAmount, 0)
      logger.debug(
        `withdrawBitcoinFromCoreWallet: ${roundedSatoshiAmount} to ${recipientAddress}`
      )
      requestBody.amount = roundedSatoshiAmount
      dispatch(withdrawingCoreBalance(recipientAddress, amount))
    } else {
      dispatch(withdrawingCoreBalance(recipientAddress, 1))
      logger.debug(
        `withdrawBitcoinFromCoreWallet: send all money to ${recipientAddress}`
      )
    }

    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorizationHeaderValue(coreAPIPassword)
    }

    if (paymentKey) {
      // Core registers with an uncompressed address,
      // browser expects compressed addresses,
      // we need to add a suffix to indicate to core
      // that it should use a compressed addresses
      // see https://en.bitcoin.it/wiki/Wallet_import_format
      // and https://github.com/blockstack/blockstack-browser/issues/607
      const compressedPublicKeySuffix = '01'
      const key = `${paymentKey}${compressedPublicKeySuffix}`
      requestBody.payment_key = key
      logger.debug('withdrawBitcoinFromCoreWallet: Using provided payment key')
    } else {
      logger.debug(
        'withdrawBitcoinFromCoreWallet: No payment key, using core wallet'
      )
    }

    return fetch(coreWalletWithdrawUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(requestBody)
    })
      .then(response => response.text())
      .then(responseText => JSON.parse(responseText))
      .then(responseJson => {
        if (responseJson.error) {
          dispatch(withdrawCoreBalanceError(responseJson.error))
        } else {
          dispatch(withdrawCoreBalanceSuccess())
        }
      })
      .catch(error => {
        logger.error('withdrawBitcoinFromCoreWallet:', error)
        dispatch(withdrawCoreBalanceError(error))
      })
  }
}

function refreshBalances(balanceURL, addresses) {
  return dispatch => {
    const results = []
    return Promise.all(
      addresses.map(address => {
        logger.debug( 
          `refreshBalances: refreshing balances for address ${address}`
        )

        return fetch(`${balanceURL}${address}`)
          .then(response => response.text())
          .then(response => {
            results.push({
              address,
              balance: satoshisToBtc(parseInt(response))
            })

            if (results.length >= addresses.length) {
              let balances = {}
              let total = 0.0

              for (let i = 0; i < results.length; i++) {
                const thisAddress = results[i].address
                if (!balances.hasOwnProperty(thisAddress)) {
                  const balance = results[i].balance
                  total = total + balance
                  balances[thisAddress] = balance
                } else {
                  logger.error(
                    `refreshBalances: Duplicate address ${thisAddress} in addresses array`
                  )
                }
              }
              balances.total = total
              dispatch(updateBalances(balances))
            }
          })
          .catch(error => {
            logger.error(
              `refreshBalances: error fetching ${address} balance`,
              error
            )
          })
      })
    )
      .then(() => {
        logger.debug(
          'refreshBalances: done refreshing balances for all addresses'
        )
      })
      .catch(error => {
        logger.error(
          'refreshBalances: error refreshing balances for addresses',
          error
        )
      })
  }
}

const initializeWallet = (
  password,
  backupPhrase,
  identitiesToGenerate = 1
) => async dispatch => {
  const bip39 = await import(/* webpackChunkName: 'bip39' */ 'bip39')
  logger.debug('initializeWallet started')
  let masterKeychain = null
  if (backupPhrase && bip39.validateMnemonic(backupPhrase)) {
    const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
    logger.debug(`seedBuffer: ${seedBuffer}`)
    masterKeychain = HDNode.fromSeedBuffer(seedBuffer)
    logger.debug(`masterKeychain: ${masterKeychain}`)
  } else {
    logger.debug('Create a new wallet')
    const STRENGTH = 128 // 128 bits generates a 12 word mnemonic
    backupPhrase = bip39.generateMnemonic(STRENGTH, randomBytes)
    const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
    masterKeychain = HDNode.fromSeedBuffer(seedBuffer)
  }
  const ciphertextBuffer = await encrypt(new Buffer(backupPhrase), password)
  logger.debug(`ciphertextBuffer: ${ciphertextBuffer}`)
  const encryptedBackupPhrase = ciphertextBuffer.toString('hex')
  logger.debug(`encryptedBackupPhrase: ${encryptedBackupPhrase}`)
  return dispatch(
    createAccount(encryptedBackupPhrase, masterKeychain, identitiesToGenerate)
  )
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
  logger.info('usedIdentityAddress')
  return dispatch => {
    dispatch(incrementIdentityAddressIndex())
  }
}

function refreshAllIdentitySettings(
  api: { gaiaHubConfig: GaiaHubConfig },
  ownerAddresses: Array<string>,
  identityKeyPairs: Array<object>
) {
  return dispatch => {
    const promises: Array<Promise<*>> = ownerAddresses.map((address, index) => {
      const promise: Promise<*> = new Promise((resolve, reject) => {
        const keyPair = identityKeyPairs[index]
        return fetchIdentitySettings(api, address, keyPair)
          .then((settings) => {
            resolve(settings)
          })
          .catch(error => reject(error))
      })
      return promise
    })

    return Promise.all(promises)
      .then(settings => {
        return dispatch(updateAllIdentitySettings(settings))
      })
      .catch((error) => {
        logger.error(
          'refreshIdentitySettings: error refreshing identity settings',
          error
        )
        return Promise.reject(error)
      })
  }
}

function refreshIdentitySettings(
  api: { gaiaHubConfig: GaiaHubConfig },
  identityIndex: int,
  ownerAddress: string,
  identityKeyPair: { key: string }
) {
  return dispatch => fetchIdentitySettings(api, ownerAddress, identityKeyPair)
    .then((settings) => {
      return dispatch(updateIdentitySettings(identityIndex, settings))
    })
}

function updateAllIdentitySettings(settings) {
  return {
    type: types.UPDATE_ALL_IDENTITY_SETTINGS,
    settings
  }
}

function updateIdentitySettings(identityIndex, settings) {
  return {
    type: types.UPDATE_IDENTITY_SETTINGS,
    identityIndex,
    settings
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
  buildBitcoinTransaction,
  broadcastBitcoinTransaction,
  withdrawBitcoinFromCoreWallet,
  emailNotifications,
  skipEmailBackup,
  storageIsConnected,
  updateViewedRecoveryCode,
  doVerifyRecoveryCode,
  incrementIdentityAddressIndex,
  usedIdentityAddress,
  displayedRecoveryCode,
  newIdentityAddress,
  updateEmail,
  refreshAllIdentitySettings,
  refreshIdentitySettings,
  updateAllIdentitySettings,
  updateIdentitySettings
}

export default AccountActions
