import { ThunkAction } from 'redux-thunk'
import { Wallet } from '@blockstack/keychain'
import { WalletActions, RESTORE_WALLET, IS_RESTORING_WALLET } from './types'

export function didRestoreWallet(wallet: Wallet): WalletActions {
  return {
    type: RESTORE_WALLET,
    payload: wallet
  }
}

function isRestoringWallet(): WalletActions {
  return {
    type: IS_RESTORING_WALLET
  }
}

export function doStoreSeed(seed: string): ThunkAction<void, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet())
    const wallet = await Wallet.restore('password', seed)
    dispatch(didRestoreWallet(wallet))
  }
}
