import { ThunkAction } from 'redux-thunk';
import { Wallet } from '@blockstack/keychain';
import {
  WalletActions,
  RESTORE_WALLET,
  IS_RESTORING_WALLET,
  GENERATE_WALLET,
  SIGN_OUT,
} from './types';
import { ChainID } from '@blockstack/stacks-transactions';

export function didRestoreWallet(wallet: Wallet): WalletActions {
  return {
    type: RESTORE_WALLET,
    payload: wallet,
  };
}

export function didGenerateWallet(wallet: Wallet): WalletActions {
  return {
    type: GENERATE_WALLET,
    payload: wallet,
  };
}

function isRestoringWallet(): WalletActions {
  return {
    type: IS_RESTORING_WALLET,
  };
}

export function doSignOut(): WalletActions {
  return {
    type: SIGN_OUT,
  };
}

export function doStoreSeed(
  secretKey: string,
  password: string
): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.restore(password, secretKey, ChainID.Mainnet);
    dispatch(didRestoreWallet(wallet));
    return wallet;
  };
}

export function doGenerateWallet(
  password: string
): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.generate(password, ChainID.Mainnet);
    dispatch(didGenerateWallet(wallet));
    return wallet;
  };
}
