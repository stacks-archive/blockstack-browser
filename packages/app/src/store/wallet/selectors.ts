import { AppState } from '..';

export const selectCurrentWallet = (state: AppState) => {
  return state.wallet.currentWallet;
};
export const selectIdentities = (state: AppState) => state.wallet.identities;
export const selectFirstIdentity = (state: AppState) => state.wallet.currentWallet?.identities[0];

export const selectSeed = (state: AppState) => state.wallet.seed;

export const selectIsRestoringWallet = (state: AppState) => state.wallet.isRestoringWallet;
