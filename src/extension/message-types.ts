import { FinishedTxPayload, SponsoredFinishedTxPayload } from '@stacks/connect';

export const MESSAGE_SOURCE = 'stacks-wallet' as const;

export const CONTENT_SCRIPT_PORT = 'content-script-messenger' as const;

export const APP_PORT = 'app-messenger' as const;

//
// Content Script <-> Background messaging
export enum InternalMethods {
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
  method: InternalMethods;
}

interface Message<M extends InternalMethods, P> extends MessageBase {
  method: M;
  payload: P;
}

export type AuthenticationRequestMessage = Message<InternalMethods.authenticationRequest, string>;

export type AuthenticationResponseMessage = Message<
  InternalMethods.authenticationResponse,
  {
    authenticationRequest: string;
    authenticationResponse: string;
  }
>;

export type TransactionRequestMessage = Message<InternalMethods.transactionRequest, string>;

export type TxResult = SponsoredFinishedTxPayload | FinishedTxPayload;

export type TransactionResponseMessage = Message<
  InternalMethods.transactionResponse,
  {
    transactionRequest: string;
    transactionResponse: TxResult;
  }
>;

export type MessageFromContentScript = AuthenticationRequestMessage | TransactionRequestMessage;

export type MessageToContentScript = AuthenticationResponseMessage | TransactionResponseMessage;

//
// Popup <-> BackgroundScript
type AppMessage<M extends InternalMethods, P> = Omit<Message<M, P>, 'source'>;

export type WalletRequest = AppMessage<InternalMethods.walletRequest, undefined>;
export type MakeWallet = AppMessage<InternalMethods.makeWallet, undefined>;
export type StoreSeed = AppMessage<
  InternalMethods.storeSeed,
  { secretKey: string; password?: string }
>;
export type CreateNewAccount = AppMessage<InternalMethods.createNewAccount, undefined>;
export type SignOut = AppMessage<InternalMethods.signOut, undefined>;
export type SetPassword = AppMessage<InternalMethods.setPassword, string>;
export type UnlockWallet = AppMessage<InternalMethods.unlockWallet, string>;
export type LockWallet = AppMessage<InternalMethods.lockWallet, undefined>;
export type SwitchAccount = AppMessage<InternalMethods.switchAccount, number>;

export type VaultMessageFromApp =
  | WalletRequest
  | MakeWallet
  | StoreSeed
  | CreateNewAccount
  | SignOut
  | SetPassword
  | UnlockWallet
  | SwitchAccount
  | LockWallet;

//
// Inpage script <-> Content script
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
