import { getInsightUrls } from '../../app/js/utils/bitcoin-utils'

const PRODUCTION_INSIGHT_API_URL = 'https://utxo.blockstack.org/insight-api/addr/{address}'

describe('bitcoin-utils', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('getInsightUrls', () => {
    describe('returns an object', () => {
      describe('with .base', () => {
        const REGTEST_API_PASSWORD = 'blockstack_integration_test_api_password'
        const API_PASSWORD = 'some-other-password'
        const address = '1LzAUWDpM5xLXE8E5NgY24uWxeZsbEMrj7'
        describe('returning insight api url with address', () => {
          it('regtest when provided with regtest api password', () => {
            const expectedResult = 'http://localhost:6270/insight-api/addr/1LzAUWDpM5xLXE8E5NgY24uWxeZsbEMrj7'
            const actualResult = getInsightUrls(PRODUCTION_INSIGHT_API_URL, address, REGTEST_API_PASSWORD).base
            assert.equal(actualResult, expectedResult)
          })

          it('production when provided with production password', () => {
            const expectedResult = 'https://utxo.blockstack.org/insight-api/addr/1LzAUWDpM5xLXE8E5NgY24uWxeZsbEMrj7'
            const actualResult = getInsightUrls(PRODUCTION_INSIGHT_API_URL, address, API_PASSWORD).base
            assert.equal(actualResult, expectedResult)
          })

          describe('and with subpath urls containing .base', () => {
            let result

            beforeEach(() => {
              result = getInsightUrls(PRODUCTION_INSIGHT_API_URL, address, API_PASSWORD)
            })

            it('.confirmedBalanceUrl', () => {
              const base = new RegExp(result.base)
              assert.equal(!!result.confirmedBalanceUrl.match(base), true)
            })

            it('.unconfirmedBalanceUrl', () => {
              const base = new RegExp(result.base)
              assert.equal(!!result.unconfirmedBalanceUrl.match(base), true)
            })
          })
        })
      })
    })
  })
})
