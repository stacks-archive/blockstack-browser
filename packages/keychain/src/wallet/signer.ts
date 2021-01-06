import {
  makeContractCall,
  makeContractDeploy,
  TransactionVersion,
  ClarityValue,
  StacksTestnet,
  makeSTXTokenTransfer,
  PostConditionMode,
  getAddressFromPrivateKey,
  PostCondition,
  StacksNetwork,
} from '@blockstack/stacks-transactions';
import RPCClient from '@stacks/rpc-client';
import { bip32 } from 'bitcoinjs-lib';
import { assertIsTruthy } from '../utils';
import BN from 'bn.js';

interface ContractCallOptions {
  contractName: string;
  contractAddress: string;
  functionName: string;
  functionArgs: ClarityValue[];
  version: TransactionVersion;
  nonce?: number;
  postConditions?: PostCondition[];
  postConditionMode?: PostConditionMode;
  network?: StacksNetwork;
}

interface ContractDeployOptions {
  contractName: string;
  codeBody: string;
  version: TransactionVersion;
  nonce?: number;
  postConditions?: PostCondition[];
  postConditionMode?: PostConditionMode;
  network?: StacksNetwork;
}

interface STXTransferOptions {
  recipient: string;
  amount: string;
  memo?: string;
  nonce?: number;
  postConditions?: PostCondition[];
  postConditionMode?: PostConditionMode;
  network?: StacksNetwork;
}

export class WalletSigner {
  privateKey: string;

  constructor({ privateKey }: { privateKey: string }) {
    this.privateKey = privateKey;
  }

  getSTXAddress(version: TransactionVersion) {
    return getAddressFromPrivateKey(this.privateKey, version);
  }

  getSTXPrivateKey() {
    const node = bip32.fromBase58(this.privateKey);
    assertIsTruthy<Buffer>(node.privateKey);
    return node.privateKey;
  }

  getNetwork() {
    const network = new StacksTestnet();
    network.coreApiUrl = 'https://stacks-node-api.blockstack.org';
    return network;
  }

  async fetchAccount({
    version,
    rpcClient,
  }: {
    version: TransactionVersion;
    rpcClient: RPCClient;
  }) {
    const address = this.getSTXAddress(version);
    const account = await rpcClient.fetchAccount(address);
    return account;
  }

  async signContractCall({
    contractName,
    contractAddress,
    functionName,
    functionArgs,
    postConditionMode,
    postConditions,
    network,
    nonce,
  }: ContractCallOptions) {
    const tx = await makeContractCall(
      this.wrapFee({
        contractAddress,
        contractName,
        functionName,
        functionArgs,
        fee: this.getFee(),
        senderKey: this.privateKey,
        network: network || this.getNetwork(),
        postConditionMode,
        postConditions,
        nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
      })
    );
    return tx;
  }

  async signContractDeploy({
    contractName,
    codeBody,
    postConditionMode,
    postConditions,
    network,
    nonce,
  }: ContractDeployOptions) {
    const tx = await makeContractDeploy(
      this.wrapFee({
        contractName,
        codeBody: codeBody,
        senderKey: this.privateKey,
        network: network || this.getNetwork(),
        postConditionMode,
        postConditions,
        nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
      })
    );
    return tx;
  }

  async signSTXTransfer({
    recipient,
    amount,
    memo,
    postConditionMode,
    postConditions,
    network,
    nonce,
  }: STXTransferOptions) {
    const tx = await makeSTXTokenTransfer(
      this.wrapFee({
        recipient,
        amount: new BN(amount),
        memo,
        senderKey: this.privateKey,
        network: network || this.getNetwork(),
        postConditionMode,
        postConditions,
        nonce: nonce !== undefined ? new BN(nonce, 10) : undefined,
      })
    );
    return tx;
  }

  getFee() {
    if (process.env.NODE_ENV === 'test') {
      return new BN(0);
    }
    return undefined;
  }

  wrapFee<T>(options: T) {
    const fee = this.getFee();
    if (fee !== undefined) {
      return {
        ...options,
        fee,
      };
    }
    return options;
  }
}
