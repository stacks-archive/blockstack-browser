import { IAppState } from '@store'

export const selectCurrentWallet = (state: IAppState) => {
  return state.wallet.currentWallet
}

export const selectSeed = (state: IAppState) => state.wallet.seed
