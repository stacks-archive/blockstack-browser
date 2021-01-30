import { UserSession } from '@stacks/auth';
import type { AuthOptions } from '../types/auth';
import {
  PostConditionMode,
  PostCondition,
  AnchorMode,
  ClarityValue,
  StacksTransaction,
} from '@stacks/transactions';
import { StacksNetwork } from '@stacks/network';
import BN from 'bn.js';

export interface TxBase {
  appDetails?: AuthOptions['appDetails'];
  postConditionMode?: PostConditionMode;
  postConditions?: (string | PostCondition)[];
  network?: StacksNetwork;
  anchorMode?: AnchorMode;
  /**
   * Provide the Stacks Wallet with a suggested account to sign this transaction with.
   * This is set by default if a `userSession` option is provided.
   */
  stxAddress?: string;
  /** @deprecated `unused - only included for compatibility with @stacks/transactions` */
  senderKey?: string;
  /** @deprecated `unused - only included for compatibility with @stacks/transactions` */
  nonce?: number;
}

export interface FinishedTxPayload {
  txId: string;
  txRaw: string;
}

export interface FinishedTxData extends FinishedTxPayload {
  txId: string;
  txRaw: string;
  stacksTransaction: StacksTransaction;
}

export enum TransactionTypes {
  ContractCall = 'contract_call',
  ContractDeploy = 'smart_contract',
  STXTransfer = 'token_transfer',
}

/**
 * Contract Call
 */

export enum ContractCallArgumentType {
  BUFFER = 'buffer',
  UINT = 'uint',
  INT = 'int',
  PRINCIPAL = 'principal',
  BOOL = 'bool',
}

export interface ContractCallBase extends TxBase {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: (string | ClarityValue)[];
}

export interface ContractCallOptions extends ContractCallBase {
  /**
   * @deprecated Authentication is no longer supported through a hosted
   * version. Users must install an extension.
   */
  authOrigin?: string;
  userSession?: UserSession;
  /** @deprecated use `onFinish` */
  finished?: (data: FinishedTxData) => void;
  onFinish?: (data: FinishedTxData) => void;
}

export interface ContractCallArgument {
  type: ContractCallArgumentType;
  value: string;
}

export interface ContractCallPayload extends ContractCallBase {
  txType: TransactionTypes.ContractCall;
  publicKey: string;
  functionArgs: string[];
}

/**
 * Contract Deploy
 */
export interface ContractDeployBase extends TxBase {
  contractName: string;
  codeBody: string;
}

export interface ContractDeployOptions extends ContractDeployBase {
  /**
   * @deprecated Authentication is no longer supported through a hosted
   * version. Users must install an extension.
   */
  authOrigin?: string;
  userSession?: UserSession;
  /** @deprecated use `onFinish` */
  finished?: (data: FinishedTxData) => void;
  onFinish?: (data: FinishedTxData) => void;
}

export interface ContractDeployPayload extends ContractDeployOptions {
  publicKey: string;
  txType: TransactionTypes.ContractDeploy;
}

/**
 * STX Transfer
 */

export interface STXTransferBase extends TxBase {
  recipient: string;
  amount: BN | string;
  memo?: string;
}

export interface STXTransferOptions extends STXTransferBase {
  /**
   * @deprecated Authentication is no longer supported through a hosted
   * version. Users must install an extension.
   */
  authOrigin?: string;
  userSession?: UserSession;
  /** @deprecated use `onFinish` */
  finished?: (data: FinishedTxData) => void;
  onFinish?: (data: FinishedTxData) => void;
}

export interface STXTransferPayload extends STXTransferOptions {
  publicKey: string;
  txType: TransactionTypes.STXTransfer;
  amount: string;
}

/**
 * Transaction Popup
 */

export type TransactionOptions = ContractCallOptions | ContractDeployOptions | STXTransferOptions;
export type TransactionPayload = ContractCallPayload | ContractDeployPayload | STXTransferPayload;

export interface TransactionPopup {
  token: string;
  options: TransactionOptions;
}
