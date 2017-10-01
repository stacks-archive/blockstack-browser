import { DROPBOX } from '../../../account/utils/index'

export const REGTEST_CORE_API_PASSWORD = 'blockstack_integration_test_api_password'
export const REGTEST_CORE_INSIGHT_API_URL =
  'http://localhost:6270/insight-api/addr/{address}'

// DEFAULT_API values are only used if
// the user's settings.api state doesn't
// already have an existing key.
// To change a value, use a new key.
const DEFAULT_API = {
  apiCustomizationEnabled: true,
  nameLookupUrl: 'http://localhost:6270/v1/names/{name}',
  searchServiceUrl: 'https://core.blockstack.org/v1/search?query={query}',
  registerUrl: 'http://localhost:6270/v1/names',
  bitcoinAddressLookupUrl: 'http://localhost:6270/v1/addresses/bitcoin/{address}',
  zeroConfBalanceUrl: 'http://localhost:6270/v1/wallet/balance/0',
  utxoUrl: 'https://utxo.blockstack.org/insight-api/addr/{address}/utxo',
  broadcastUrl: 'https://utxo.blockstack.org/insight-api/tx/send',
  priceUrl: 'http://localhost:6270/v1/prices/names/{name}',
  networkFeeUrl: 'https://bitcoinfees.21.co/api/v1/fees/recommended',
  walletPaymentAddressUrl: 'http://localhost:6270/v1/wallet/payment_address',
  pendingQueuesUrl: 'http://localhost:6270/v1/blockchains/bitcoin/pending',
  coreWalletWithdrawUrl: 'http://localhost:6270/v1/wallet/balance',
  bitcoinAddressUrl: 'https://explorer.blockstack.org/address/{identifier}',
  ethereumAddressUrl: 'https://tradeblock.com/ethereum/account/{identifier}',
  pgpKeyUrl: 'https://pgp.mit.edu/pks/lookup?search={identifier}&op=vindex&fingerprint=on',
  btcPriceUrl: 'https://www.bitstamp.net/api/v2/ticker/btcusd/',
  corePingUrl: 'http://localhost:6270/v1/node/ping',
  zoneFileUrl: 'http://localhost:6270/v1/names/{name}/zonefile',
  nameTransferUrl: 'http://localhost:6270/v1/names/{name}/owner',
  subdomains: {
    'foo.id': {
      registerUrl: 'http://localhost:7103/register'
    }
  },
  hostedDataLocation: DROPBOX,
  coreHost: 'localhost',
  corePort: 6270,
  coreAPIPassword: null,
  logServerPort: '',
  s3ApiKey: '',
  s3ApiSecret: '',
  s3Bucket: '',
  dropboxAccessToken: null,
  btcPrice: '1000.00'
}

export default DEFAULT_API
