import { SettingsActions } from '../../../../../app/js/account/store/settings'
import DEFAULT_API from '../../../../../app/js/account/store/settings/default'

describe('Settings Store: Sync Actions', () => {
  describe('resetApi', () => {
    it('should return an action of type UPDATE_API with default API', () => {
      const initialApi = {
        lookupUrl: 'https://example.com/v1/lookup'
      }
      const expectedResult = {
        type: 'UPDATE_API',
        api: Object.assign({}, DEFAULT_API)
      }
      const actualResult = SettingsActions.resetApi(initialApi)
      const dispatch = (action) => {
        assert.deepEqual(action, expectedResult)
        assert.notDeepEqual(action.api, initialApi)
      }
      actualResult(dispatch)
    })

    it('should preserve core api & dropbox credentials in returned UPDATE_API', () => {
      const initialApi = {
        lookupUrl: 'https://example.com/v1/lookup',
        dropboxAccessToken: 'abc',
        coreAPIPassword: 'xyz'
      }
      const expectedResult = {
        type: 'UPDATE_API',
        api: Object.assign({}, DEFAULT_API, {
          dropboxAccessToken: 'abc',
          coreAPIPassword: 'xyz'
        })
      }
      const actualResult = SettingsActions.resetApi(initialApi)
      const dispatch = (action) => {
        assert.deepEqual(action, expectedResult)
        assert.notDeepEqual(action.api, initialApi)
        assert.equal(action.api.coreAPIPassword, initialApi.coreAPIPassword)
        assert.equal(action.api.dropboxAccessToken, initialApi.dropboxAccessToken)
      }
      actualResult(dispatch)
    })
  })

  describe('updateApi', () => {
    it('should return an action of type UPDATE_API with new API', () => {
      const initialApi = {
        lookupUrl: 'https://example.com/v1/lookup'
      }
      const expectedResult = {
        type: 'UPDATE_API',
        api: {
          lookupUrl: 'https://example.com/v2/lookup'
        }
      }
      const actualResult = SettingsActions.updateApi({
        lookupUrl: 'https://example.com/v2/lookup'
      })
      assert.deepEqual(actualResult, expectedResult)
      assert.notDeepEqual(actualResult.api, initialApi)
    })
  })

  describe('updateBtcPrice', () => {
    it('should return an action of type UPDATE_BTC_PRICE with new price', () => {
      const expectedResult = {
        type: 'UPDATE_BTC_PRICE',
        price: '10000.00'
      }
      const actualResult = SettingsActions.updateBtcPrice('10000.00')
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
