import { ThunkAction } from 'redux-thunk';
import { Wallet } from '@blockstack/keychain';
import { WalletActions, RESTORE_WALLET, IS_RESTORING_WALLET, GENERATE_WALLET, SIGN_OUT } from './types';
import { gaiaUrl } from '@common/constants';

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

export function doStoreSeed(seed: string, password: string): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.restore(password, seed);
    const gaiaConfig = await wallet.createGaiaConfig(gaiaUrl);
    const config = await wallet.fetchConfig(gaiaConfig);
    if (config?.identities[0]?.username) {
      wallet.identities[0].defaultUsername = config.identities[0].username;
    }
    dispatch(didRestoreWallet(wallet));
    return wallet;
  };
}

export function doGenerateWallet(password: string): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async dispatch => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.generate(password);
    dispatch(didGenerateWallet(wallet));
    return wallet;
  };
}
