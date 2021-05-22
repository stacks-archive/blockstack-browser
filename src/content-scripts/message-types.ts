import { FinishedTxPayload, SponsoredFinishedTxPayload } from '@stacks/connect';

export const MESSAGE_SOURCE = 'stacks-wallet' as const;

export enum ExternalMethods {
  transactionRequest = 'transactionRequest',
  transactionResponse = 'transactionResponse',
  authenticationRequest = 'authenticationRequest',
  authenticationResponse = 'authenticationResponse',
}

export enum InternalMethods {
  getWallet = 'getWallet',
  makeWallet = 'makeWallet',
  storeSeed = 'storeSeed',
  createNewAccount = 'createNewAccount',
  signOut = 'signOut',
  setPassword = 'setPassword',
  switchAccountIndex = 'switchAccountIndex',
  unlockWallet = 'unlockWallet',
  lockWallet = 'lockWallet',
  switchAccount = 'switchAccount',
}

export type ExtensionMethods = ExternalMethods | InternalMethods;

interface BaseMessage {
  source: typeof MESSAGE_SOURCE;
  method: ExtensionMethods;
}

/*
 * Content Script <-> Background Script
 */
export interface Message<M extends ExtensionMethods, P> extends BaseMessage {
  method: M;
  payload: P;
}

export type AuthenticationRequestMessage = Message<ExternalMethods.authenticationRequest, string>;

export type AuthenticationResponseMessage = Message<
  ExternalMethods.authenticationResponse,
  {
    authenticationRequest: string;
    authenticationResponse: string;
  }
>;

export type TransactionRequestMessage = Message<ExternalMethods.transactionRequest, string>;

export type TxResult = SponsoredFinishedTxPayload | FinishedTxPayload;

export type TransactionResponseMessage = Message<
  ExternalMethods.transactionResponse,
  {
    transactionRequest: string;
    transactionResponse: TxResult;
  }
>;

export type MessageFromContentScript = AuthenticationRequestMessage | TransactionRequestMessage;
export type MessageToContentScript = AuthenticationResponseMessage | TransactionResponseMessage;
