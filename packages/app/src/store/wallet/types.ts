import { Wallet, Identity } from '@stacks/keychain';

export const RESTORE_WALLET = 'WALLET/RESTORE_WALLET';
export const IS_RESTORING_WALLET = 'WALLET/IS_RESTORING';
export const GENERATE_WALLET = 'WALLET/GENERATE';
export const SIGN_OUT = 'WALLET/SIGN_OUT';
export const ADD_NETWORK = 'WALLET/ADD_NETWORK';
export const CHANGE_NETWORK = 'WALLET/CHANGE_NETWORK';
export const SET_IDENTITY_INDEX = 'WALLET/SET_IDENTITY_INDEX';

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

interface SetIdentityAction {
  type: typeof SET_IDENTITY_INDEX;
  index: number;
}

export interface WalletState {
  secretKey?: string;
  isRestoringWallet: boolean;
  currentWallet?: Wallet;
  identities: Identity[];
  currentIdentityIndex: number;
}

export type WalletActions =
  | StoreSeedAction
  | IsRestoringWalletAction
  | GenerateWalletAction
  | SetIdentityAction
  | LogOutAction;
