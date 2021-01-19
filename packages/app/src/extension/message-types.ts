import { FinishedTxPayload } from '@stacks/connect';
/**
 * Content Script <-> Background messaging
 */

export const MESSAGE_SOURCE = 'stacks-wallet' as const;

export enum Methods {
  transactionRequest = 0,
  authenticationRequest = 1,
  transactionResponse = 2,
  authenticationResponse = 3,
}

export interface MessageBase {
  source: typeof MESSAGE_SOURCE;
  method: Methods;
}

export interface AuthenticationRequestMessage extends MessageBase {
  method: Methods.authenticationRequest;
  payload: string;
}

export interface AuthenticationResponseMessage extends MessageBase {
  method: Methods.authenticationResponse;
  payload: {
    authenticationRequest: string;
    authenticationResponse: string;
  };
}

export interface TransactionRequestMessage extends MessageBase {
  method: Methods.transactionRequest;
  payload: string;
}

export interface TransactionResponseMessage extends MessageBase {
  method: Methods.transactionResponse;
  payload: {
    transactionRequest: string;
    transactionResponse: FinishedTxPayload;
  };
}

export type MessageFromContentScript = AuthenticationRequestMessage | TransactionRequestMessage;

export type MessageToContentScript = AuthenticationResponseMessage | TransactionResponseMessage;

/**
 * Inpage script <-> Content script
 */

export enum DomEventName {
  authenticationRequest = 'stacksAuthenticationRequest',
  transactionRequest = 'stacksTransactionRequest',
}

export interface AuthenticationRequestEventDetails {
  authenticationRequest: string;
}

export type AuthenticationRequestEvent = CustomEvent<AuthenticationRequestEventDetails>;

export interface TransactionRequestEventDetails {
  transactionRequest: string;
}

export type TransactionRequestEvent = CustomEvent<TransactionRequestEventDetails>;

export type DomEvent = TransactionRequestEvent | AuthenticationRequestEvent;
