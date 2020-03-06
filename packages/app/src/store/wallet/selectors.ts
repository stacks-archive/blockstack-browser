import { AppState } from '..';

export const selectCurrentWallet = (state: AppState) => state.wallet.currentWallet;
export const selectIdentities = (state: AppState) => state.wallet.identities;
export const selectFirstIdentity = (state: AppState) => state.wallet.currentWallet?.identities[0];
export const selectIsSignedIn = (state: AppState) => state.wallet.identities?.length > 1;
export const selectIsRestoringWallet = (state: AppState) => state.wallet.isRestoringWallet;
