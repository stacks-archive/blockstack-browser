import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { PGPActions } from '../../../../../app/js/profiles/store/pgp'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

// mock proxyFetch

global.proxyFetch = (url, options) => fetch.call(this, url, options)


describe('PGP Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('loadPGPPublicKey', () => {
    it('returns the pgp public key', () => {
      nock('https://example.com')
      .get('/key.asc')
      .reply(200, 'XYZ', { 'Content-Type': 'text/plain; charset=utf-8' })

      const store = mockStore({
        publicKeys: {}
      })

      const contentUrl = 'https://example.com/key.asc'
      return store.dispatch(PGPActions.loadPGPPublicKey(contentUrl, 'ABCDEF'))
      .then(() => {
        const expectedActions = [{ type: 'LOADING_PGP_KEY',
                                   identifier: 'ABCDEF' },
          { type: 'LOADED_PGP_KEY',
            identifier: 'ABCDEF',
            key: 'XYZ' }]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })
})
