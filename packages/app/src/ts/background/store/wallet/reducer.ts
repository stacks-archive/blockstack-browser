import { Reducer } from 'redux'
import { WalletActions, WalletState, RESTORE_WALLET, IS_RESTORING_WALLET, GENERATE_WALLET } from './types'

const initialState: WalletState = {
  seed: null,
  isRestoringWallet: false,
  currentWallet: null
}

export const walletReducer: Reducer<WalletState, WalletActions> = (
  state = initialState,
  action: WalletActions
): WalletState => {
  switch (action.type) {
    case RESTORE_WALLET:
      return {
        ...state,
        currentWallet: action.payload,
        isRestoringWallet: false
      }
    case IS_RESTORING_WALLET:
      return {
        ...state,
        isRestoringWallet: true
      }
    case GENERATE_WALLET:
      return {
        ...state,
        currentWallet: action.payload
      }
    default:
      return state
  }
}
