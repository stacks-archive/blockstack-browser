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
    name: 'sip-10-ft-standard',
    trait: 'ft-trait',
  },
  testnet: {
    address: 'ST3YK7KWMYRCDMV5M4792T0T7DERQXHJJGHT96SVC',
    name: 'sip-10-ft-standard',
    trait: 'ft-trait',
  },
  regtest: {
    address: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
    name: 'ft-trait',
    trait: 'ft-trait',
  },
};
