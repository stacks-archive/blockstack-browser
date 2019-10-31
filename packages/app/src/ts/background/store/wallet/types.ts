import Wallet from 'blockstack-keychain/lib-esm/wallet'

export const RESTORE_WALLET = 'WALLET/RESTORE_WALLET'
export const IS_RESTORING_WALLET = 'WALLET/IS_RESTORING'

interface StoreSeedAction {
  type: typeof RESTORE_WALLET
  payload: Wallet
}

interface IsRestoringWalletAction {
  type: typeof IS_RESTORING_WALLET
}

export interface WalletState {
  seed: string | null
  isRestoringWallet: boolean
  currentWallet: Wallet | null
}

export type WalletActions = StoreSeedAction | IsRestoringWalletAction
