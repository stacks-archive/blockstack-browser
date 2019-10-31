import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import Wallet from 'blockstack-keychain/lib-esm/wallet'
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
  return (dispatch: ThunkDispatch<{}, {}, WalletActions>) => {
    dispatch(isRestoringWallet())
    const url = chrome.runtime.getURL ? chrome.runtime.getURL('worker.js') : './worker.js'
    const worker = new Worker(url)
    worker.postMessage({ seed, password: 'password' })
    worker.addEventListener('message', event => {
      const wallet = new Wallet(event.data)
      console.log('Worker finished restoring wallet', wallet)
      dispatch(didRestoreWallet(wallet))
    })
  }
}
