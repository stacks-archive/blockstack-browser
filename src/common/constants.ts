import { ChainID } from '@stacks/transactions';

export const gaiaUrl = 'https://hub.blockstack.org';

export const transition = 'all .2s cubic-bezier(.215,.61,.355,1)';

export const USERNAMES_ENABLED = process.env.USERNAMES_ENABLED === 'true';
export const IS_TEST_ENV = process.env.TEST_ENV === 'true';

export const STX_DECIMALS = 6;

export const STACKS_MARKETS_URL = 'https://coinmarketcap.com/currencies/stacks/markets/';

export const KEBAB_REGEX = /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g;

export const POPUP_WIDTH = 442;
export const POPUP_HEIGHT = 646;

export const SIP_010 = {
  mainnet: {
    address: 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE',
    name: 'sip-010-trait-ft-standard',
    trait: 'sip-010-trait',
  },
  testnet: {
    address: 'STR8P3RD1EHA8AA37ERSSSZSWKS9T2GYQFGXNA4C',
    name: 'sip-010-trait-ft-standard',
    trait: 'sip-010-trait',
  },
  regtest: {
    address: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
    name: 'ft-trait',
    trait: 'ft-trait',
  },
};

export interface Network {
  url: string;
  name: string;
  chainId: ChainID;
}

export type Networks = Record<string, Network>;

export const defaultNetworks: Networks = {
  mainnet: {
    url: 'https://stacks-node-api.mainnet.stacks.co',
    name: 'Mainnet',
    chainId: ChainID.Mainnet,
  },
  testnet: {
    url: 'https://stacks-node-api.testnet.stacks.co',
    name: 'Testnet',
    chainId: ChainID.Testnet,
  },
  regtest: {
    url: 'https://stacks-node-api.regtest.stacks.co',
    name: 'Regtest',
    chainId: ChainID.Testnet,
  },
  localnet: {
    url: 'http://localhost:3999',
    name: 'Localnet',
    chainId: ChainID.Testnet,
  },
} as const;

export enum QueryRefreshRates {
  SLOW = 30_000,
  QUICK = 10_000,
  FAST = 3_500,
}
