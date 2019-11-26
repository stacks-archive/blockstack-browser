import Wallet from '@blockstack/keychain/dist/wallet'

export const RESTORE_WALLET = 'WALLET/RESTORE_WALLET'
export const IS_RESTORING_WALLET = 'WALLET/IS_RESTORING'
export const GENERATE_WALLET = 'WALLET/GENERATE'

interface StoreSeedAction {
  type: typeof RESTORE_WALLET
  payload: Wallet
}

interface IsRestoringWalletAction {
  type: typeof IS_RESTORING_WALLET
}

interface GenerateWalletAction {
  type: typeof GENERATE_WALLET
  payload: Wallet
}

export interface WalletState {
  seed: string | null
  isRestoringWallet: boolean
  currentWallet: Wallet | null
}

export type WalletActions = StoreSeedAction | IsRestoringWalletAction | GenerateWalletAction
