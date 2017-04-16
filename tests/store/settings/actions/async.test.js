import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { SettingsActions } from '../../../../app/js/store/settings'
import btcPrice from '../../../fixtures/btcprice'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


describe('Settings Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('refreshBtcPrice', () => {
    it('returns btc price', () => {
      nock('https://www.bitstamp.net')
      .get('/api/v2/ticker/btcusd/')
      .reply(200, btcPrice, { 'Content-Type': 'application/json' })

      const store = mockStore({
        api: {
          btcPrice: '1000.00'
        }
      })

      const btcPriceUrl = 'https://www.bitstamp.net/api/v2/ticker/btcusd/'
      return store.dispatch(SettingsActions.refreshBtcPrice(btcPriceUrl))
      .then(() => {
        const expectedActions = [{ type: 'UPDATE_BTC_PRICE',
                                   price: '1168.98'
                                 }]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })
})
