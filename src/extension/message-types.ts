import { FinishedTxPayload } from '@stacks/connect';
/**
 * Content Script <-> Background messaging
 */

export const MESSAGE_SOURCE = 'stacks-wallet' as const;

export const CONTENT_SCRIPT_PORT = 'content-script-messenger' as const;

export const APP_PORT = 'app-messenger' as const;

export enum Methods {
  transactionRequest = 'transactionRequest',
  authenticationRequest = 'authenticationRequest',
  transactionResponse = 'transactionResponse',
  authenticationResponse = 'authenticationResponse',
  walletRequest = 'walletRequest',
  walletResponse = 'walletResponse',
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

export interface MessageBase {
  source: typeof MESSAGE_SOURCE;
  method: Methods;
}

interface Message<M extends Methods, P> extends MessageBase {
  method: M;
  payload: P;
}

export type AuthenticationRequestMessage = Message<Methods.authenticationRequest, string>;

export type AuthenticationResponseMessage = Message<
  Methods.authenticationResponse,
  {
    authenticationRequest: string;
    authenticationResponse: string;
  }
>;

export type TransactionRequestMessage = Message<Methods.transactionRequest, string>;

export type TransactionResponseMessage = Message<
  Methods.transactionResponse,
  {
    transactionRequest: string;
    transactionResponse: FinishedTxPayload;
  }
>;

export type MessageFromContentScript = AuthenticationRequestMessage | TransactionRequestMessage;

export type MessageToContentScript = AuthenticationResponseMessage | TransactionResponseMessage;

/** App <-> BackgroundScript */

type AppMessage<M extends Methods, P> = Omit<Message<M, P>, 'source'>;

export type WalletRequest = AppMessage<Methods.walletRequest, undefined>;

export type MakeWallet = AppMessage<Methods.makeWallet, undefined>;

export type StoreSeed = AppMessage<Methods.storeSeed, { secretKey: string; password?: string }>;

export type CreateNewAccount = AppMessage<Methods.createNewAccount, undefined>;

export type SignOut = AppMessage<Methods.signOut, undefined>;

export type SetPassword = AppMessage<Methods.setPassword, string>;

export type UnlockWallet = AppMessage<Methods.unlockWallet, string>;

export type LockWallet = AppMessage<Methods.lockWallet, undefined>;

export type SwitchAccount = AppMessage<Methods.switchAccount, number>;

export type MessageFromApp =
  | WalletRequest
  | MakeWallet
  | StoreSeed
  | CreateNewAccount
  | SignOut
  | SetPassword
  | UnlockWallet
  | SwitchAccount
  | LockWallet;

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
