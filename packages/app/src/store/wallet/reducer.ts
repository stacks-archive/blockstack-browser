import { Reducer } from 'redux';
import {
  WalletActions,
  WalletState,
  RESTORE_WALLET,
  IS_RESTORING_WALLET,
  GENERATE_WALLET,
  SIGN_OUT,
  SET_IDENTITY_INDEX,
} from './types';

const initialState: WalletState = {
  secretKey: undefined,
  isRestoringWallet: false,
  currentWallet: undefined,
  identities: [],
  currentIdentityIndex: 0,
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
    case SET_IDENTITY_INDEX:
      return {
        ...state,
        currentIdentityIndex: action.index,
      };
    default:
      return state;
  }
};
