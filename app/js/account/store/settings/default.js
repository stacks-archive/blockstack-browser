import crypto from 'crypto'
import { BLOCKSTACK_INC } from '../../../account/utils/index'

export const REGTEST_CORE_API_PASSWORD = 'blockstack_integration_test_api_password'
export const DEFAULT_CORE_PHONY_PASSWORD = 'PretendPasswordAPI'
export const REGTEST_CORE_INSIGHT_API_URL = 'http://localhost:6270/insight-api/addr/{address}'

// DEFAULT_API values are only used if
// the user's settings.api state doesn't
// already have an existing key.
// To change a value, use a new key.

export const DEFAULT_CORE_API_ENDPOINT = 'https://core.blockstack.org'
export const REGTEST_CORE_API_ENDPOINT = 'http://localhost:6270'

const DEFAULT_API = {
  apiCustomizationEnabled: true,
  nameLookupUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names/{name}`,
  searchServiceUrl: 'https://core.blockstack.org/v1/search?query={query}',
  registerUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names`,
  bitcoinAddressLookupUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/addresses/bitcoin/{address}`,
  zeroConfBalanceUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/wallet/balance/0`,
  insightUrl: 'https://utxo.blockstack.org/insight-api/addr/{address}',
  btcBalanceUrl: 'https://blockchain.info/q/addressbalance/',
  broadcastUrl: 'https://utxo.blockstack.org/insight-api/tx/send',
  priceUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/prices/names/{name}`,
  networkFeeUrl: 'https://bitcoinfees.21.co/api/v1/fees/recommended',
  walletPaymentAddressUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/wallet/payment_address`,
  pendingQueuesUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/blockchains/bitcoin/pending`,
  coreWalletWithdrawUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/wallet/balance`,
  bitcoinAddressUrl: 'https://explorer.blockstack.org/address/{identifier}',
  ethereumAddressUrl: 'https://tradeblock.com/ethereum/account/{identifier}',
  pgpKeyUrl: 'https://pgp.mit.edu/pks/lookup?search={identifier}&op=vindex&fingerprint=on',
  btcPriceUrl: 'https://www.bitstamp.net/api/v2/ticker/btcusd/?cors=1',
  corePingUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/node/ping`,
  zoneFileUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names/{name}/zonefile`,
  nameTransferUrl: `${DEFAULT_CORE_API_ENDPOINT}/v1/names/{name}/owner`,
  subdomains: {
    'foo.id': {
      registerUrl: 'http://localhost:7103/register'
    },
    'test-personal.id': {
      registerUrl: 'https://test-registrar.blockstack.org/register'
    },
    'id.blockstack': {
      registerUrl: 'https://registrar.blockstack.org/register'
    }
  },
  browserServerUrl: 'https://blockstack-browser-server.appartisan.com',
  hostedDataLocation: BLOCKSTACK_INC,
  coreHost: 'localhost',
  corePort: 6270,
  coreAPIPassword: DEFAULT_CORE_PHONY_PASSWORD,
  logServerPort: '',
  regTestMode: false,
  storageConnected: false,
  gaiaHubConfig: null,
  gaiaHubUrl: 'https://hub.blockstack.org',
  btcPrice: '1000.00',
  distinctEventId: crypto.randomBytes(16).toString('hex'),
  hasDisabledEventTracking: false
}

export default DEFAULT_API
