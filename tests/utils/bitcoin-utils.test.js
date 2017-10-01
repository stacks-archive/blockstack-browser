import { getInsightUrl } from '../../app/js/utils/bitcoin-utils'

const PRODUCTION_INSIGHT_API_URL = 'https://utxo.blockstack.org/insight-api/addr/{address}'

describe('bitcoin-utils', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('getInsightUrl', () => {
    it('should return regtest insight api url with address', () => {
      const REGTEST_API_PASSWORD = 'blockstack_integration_test_api_password'
      const address = '1LzAUWDpM5xLXE8E5NgY24uWxeZsbEMrj7'
      const expectedResult = 'http://localhost:6270/insight-api/addr/1LzAUWDpM5xLXE8E5NgY24uWxeZsbEMrj7'

      const actualResult = getInsightUrl(PRODUCTION_INSIGHT_API_URL, address, REGTEST_API_PASSWORD)

      assert.equal(actualResult, expectedResult)
    })

    it('should return production insight api url with address', () => {
      const API_PASSWORD = 'some-other-password'
      const address = '1LzAUWDpM5xLXE8E5NgY24uWxeZsbEMrj7'
      const expectedResult = 'https://utxo.blockstack.org/insight-api/addr/1LzAUWDpM5xLXE8E5NgY24uWxeZsbEMrj7'

      const actualResult = getInsightUrl(PRODUCTION_INSIGHT_API_URL, address, API_PASSWORD)

      assert.equal(actualResult, expectedResult)
    })
  })
})
