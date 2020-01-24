import { AppState } from '..';

export const selectCurrentWallet = (state: AppState) => {
  return state.wallet.currentWallet;
};

export const selectSeed = (state: AppState) => state.wallet.seed;

export const selectIsRestoringWallet = (state: AppState) => state.wallet.isRestoringWallet;
