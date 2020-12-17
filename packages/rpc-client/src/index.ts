import BN from 'bn.js';
import { serializeCV, ClarityValue } from '@blockstack/stacks-transactions';
import { TransactionResults } from '@blockstack/stacks-blockchain-sidecar-types';
import fetch from 'cross-fetch';

export interface Account {
  balance: BN;
  nonce: number;
}

export const toBN = (hex: string) => {
  return new BN(hex.slice(2), 16);
};

interface FetchContractInterface {
  contractAddress: string;
  contractName: string;
}

interface BufferArg {
  buffer: {
    length: number;
  };
}

export interface ContractInterfaceFunctionArg {
  name: string;
  type: string | BufferArg;
}

export interface ContractInterfaceFunction {
  name: string;
  access: 'public' | 'private' | 'read_only';
  args: ContractInterfaceFunctionArg[];
}

export interface ContractInterface {
  functions: ContractInterfaceFunction[];
}
interface CallReadOnly extends FetchContractInterface {
  args: ClarityValue[];
  functionName: string;
}

export class RPCClient {
  url: string;

  /**
   * @param url The base URL for the RPC server
   */
  constructor(url: string) {
    this.url = url;
  }

  async fetchAccount(principal: string): Promise<Account> {
    const url = `${this.url}/v2/accounts/${principal}`;
    const response = await fetch(url, {
      credentials: 'omit',
    });
    const data = await response.json();
    return {
      balance: toBN(data.balance),
      nonce: data.nonce,
    };
  }

  async broadcastTX(hex: Buffer) {
    const url = `${this.url}/v2/transactions`;
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      body: hex,
    });
    return response;
  }

  async fetchContractInterface({
    contractAddress,
    contractName,
  }: FetchContractInterface) {
    const url = `${this.url}/v2/contracts/interface/${contractAddress}/${contractName}`;
    const response = await fetch(url);
    const contractInterface: ContractInterface = await response.json();
    return contractInterface;
  }

  async callReadOnly({
    contractName,
    contractAddress,
    functionName,
    args,
  }: CallReadOnly) {
    const url = `${this.url}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`;
    const argsStrings = args.map((arg) => {
      return `0x${serializeCV(arg).toString('hex')}`;
    });
    const body = {
      sender: 'SP31DA6FTSJX2WGTZ69SFY11BH51NZMB0ZW97B5P0',
      arguments: argsStrings,
    };
    console.log(body);
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error(`Unable to call read-only function.`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  }

  async fetchContractSource({
    contractName,
    contractAddress,
  }: {
    contractName: string;
    contractAddress: string;
  }) {
    const url = `${this.url}/v2/contracts/source/${contractAddress}/${contractName}`;
    const res = await fetch(url);
    if (res.ok) {
      const { source }: { source: string } = await res.json();
      return source;
    }
    return null;
  }

  async fetchAddressTransactions({ address }: { address: string }) {
    const url = `${this.url}/extended/v1/address/${address}/transactions`;
    const res = await fetch(url);
    const data: TransactionResults = await res.json();
    return data.results;
  }
}

export default RPCClient;
