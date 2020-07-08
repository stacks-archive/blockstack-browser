import { Reducer } from 'redux';
import {
  WalletActions,
  WalletState,
  RESTORE_WALLET,
  IS_RESTORING_WALLET,
  GENERATE_WALLET,
  SIGN_OUT,
} from './types';

const initialState: WalletState = {
  secretKey: undefined,
  isRestoringWallet: false,
  currentWallet: undefined,
  identities: [],
};

export const walletReducer: Reducer<WalletState, WalletActions> = (
  state = initialState,
  action: WalletActions
): WalletState => {
  switch (action.type) {
    case RESTORE_WALLET:
      return {
        ...state,
        currentWallet: action.payload,
        identities: [...action.payload.identities],
        isRestoringWallet: false,
      };
    case IS_RESTORING_WALLET:
      return {
        ...state,
        isRestoringWallet: true,
      };
    case GENERATE_WALLET:
      return {
        ...state,
        currentWallet: action.payload,
        identities: [...action.payload.identities],
      };
    case SIGN_OUT:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};
