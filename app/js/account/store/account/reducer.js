import * as types from './types'
import { HDNode } from 'bitcoinjs-lib'
import { getBitcoinAddressNode } from '../../../utils'


const initialState = {
  accountCreated: false,
  promptedForEmail: false,
  encryptedBackupPhrase: null,
  identityAccount: {
    addresses: [],
    keypairs: []
  },
  bitcoinAccount: {
    addresses: [],
    balances: { total: 0.0 }
  },
  coreWallet: {
    address: null,
    balance: 0.0,
    withdrawal: {
      inProgress: false,
      error: null,
      recipient: null,
      success: false
    }
  },
  viewedRecoveryCode: false,
  connectedStorageAtLeastOnce: false
}

function AccountReducer(state = initialState, action) {
  switch (action.type) {
    case types.CREATE_ACCOUNT:
      return Object.assign({}, state, {
        accountCreated: true,
        encryptedBackupPhrase: action.encryptedBackupPhrase,
        identityAccount: {
          publicKeychain: action.identityPublicKeychain,
          addresses: action.identityAddresses,
          keypairs: action.identityKeypairs,
          addressIndex: 0
        },
        bitcoinAccount: {
          publicKeychain: action.bitcoinPublicKeychain,
          addresses: [
            action.firstBitcoinAddress
          ],
          addressIndex: 0,
          balances: state.bitcoinAccount.balances
        }
      })
    case types.DELETE_ACCOUNT:
      return Object.assign({}, state, {
        accountCreated: false,
        encryptedBackupPhrase: null
      })
    case types.UPDATE_CORE_ADDRESS:
      return Object.assign({}, state, {
        coreWallet: Object.assign({}, state.coreWallet, {
          address: action.coreWalletAddress
        })
      })
    case types.UPDATE_CORE_BALANCE:
      return Object.assign({}, state, {
        coreWallet: Object.assign({}, state.coreWallet, {
          balance: action.coreWalletBalance
        })
      })
    case types.UPDATE_BACKUP_PHRASE:
      return Object.assign({}, state, {
        encryptedBackupPhrase: action.encryptedBackupPhrase
      })
    case types.NEW_BITCOIN_ADDRESS:
      return Object.assign({}, state, {
        bitcoinAccount: {
          publicKeychain: state.bitcoinAccount.publicKeychain,
          addresses: [
            ...state.bitcoinAccount.addresses,
            getBitcoinAddressNode(HDNode.fromBase58(state.bitcoinAccount.publicKeychain),
            state.bitcoinAccount.addressIndex + 1).getAddress()
          ],
          addressIndex: state.bitcoinAccount.addressIndex + 1,
          balances: state.bitcoinAccount.balances
        }
      })
    case types.UPDATE_BALANCES:
      return Object.assign({}, state, {
        bitcoinAccount: {
          publicKeychain: state.bitcoinAccount.publicKeychain,
          addresses: state.bitcoinAccount.addresses,
          balances: action.balances
        }
      })
    case types.RESET_CORE_BALANCE_WITHDRAWAL:
      return Object.assign({}, state, {
        coreWallet: Object.assign({}, state.coreWallet, {
          withdrawal: {
            inProgress: false,
            error: null,
            success: false,
            recipientAddress: null
          }
        })
      })
    case types.WITHDRAWING_CORE_BALANCE:
      return Object.assign({}, state, {
        coreWallet: Object.assign({}, state.coreWallet, {
          withdrawal: {
            inProgress: true,
            error: null,
            success: false,
            recipientAddress: action.recipientAddress
          }
        })
      })
    case types.WITHDRAW_CORE_BALANCE_SUCCESS:
      return Object.assign({}, state, {
        coreWallet: Object.assign({}, state.coreWallet, {
          withdrawal: Object.assign({}, state.coreWallet.withdrawal, {
            inProgress: false,
            success: true
          })
        })
      })
    case types.WITHDRAW_CORE_BALANCE_ERROR:
      return Object.assign({}, state, {
        coreWallet: Object.assign({}, state.coreWallet, {
          withdrawal: Object.assign({}, state.coreWallet.withdrawal, {
            inProgress: false,
            success: false,
            error: action.error
          })
        })
      })
    case types.PROMPTED_FOR_EMAIL:
      return Object.assign({}, state, {
        promptedForEmail: true
      })
    case types.VIEWED_RECOVERY_CODE:
      return Object.assign({}, state, {
        viewedRecoveryCode: true
      })
    case types.INCREMENT_IDENTITY_ADDRESS_INDEX:
      return Object.assign({}, state, {
        identityAccount: Object.assign({},
          state.identityAccount,
          {
            addressIndex: state.identityAccount.addressIndex + 1
          })
      })
    case types.NEW_IDENTITY_ADDRESS:
      return Object.assign({}, state, {
        identityAccount: Object.assign({}, state.identityAccount, {
          addresses: [
            ...state.identityAccount.addresses, action.keypair.address
          ],
          keypairs: [
            ...state.identityAccount.keypairs,
            action.keypair]
        })
      })
    case types.CONNECTED_STORAGE:
      return Object.assign({}, state, {
        connectedStorageAtLeastOnce: true
      })
    default:
      return state
  }
}

export default AccountReducer
