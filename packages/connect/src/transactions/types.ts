import { UserSession } from 'blockstack';
import { AuthOptions } from '../auth';
import {
  PostConditionMode,
  PostCondition,
  StacksNetwork,
  AnchorMode,
  ClarityValue,
} from '@blockstack/stacks-transactions';
import BN from 'bn.js';

export interface TxBase {
  appDetails?: AuthOptions['appDetails'];
  postConditionMode?: PostConditionMode;
  postConditions?: PostCondition[];
  network?: StacksNetwork;
  anchorMode?: AnchorMode;
  senderKey?: string;
  nonce?: number;
}

export interface FinishedTxData {
  txId: string;
  txRaw: string;
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
