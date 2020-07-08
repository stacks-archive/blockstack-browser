import { Wallet, Identity } from '@blockstack/keychain';

export const RESTORE_WALLET = 'WALLET/RESTORE_WALLET';
export const IS_RESTORING_WALLET = 'WALLET/IS_RESTORING';
export const GENERATE_WALLET = 'WALLET/GENERATE';
export const SIGN_OUT = 'WALLET/SIGN_OUT';

interface StoreSeedAction {
  type: typeof RESTORE_WALLET;
  payload: Wallet;
}

interface IsRestoringWalletAction {
  type: typeof IS_RESTORING_WALLET;
}

interface GenerateWalletAction {
  type: typeof GENERATE_WALLET;
  payload: Wallet;
}

interface LogOutAction {
  type: typeof SIGN_OUT;
}

export interface WalletState {
  secretKey?: string;
  isRestoringWallet: boolean;
  currentWallet?: Wallet;
  identities: Identity[];
}

export type WalletActions =
  | StoreSeedAction
  | IsRestoringWalletAction
  | GenerateWalletAction
  | LogOutAction;
