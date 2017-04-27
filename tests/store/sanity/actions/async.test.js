import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { SanityActions } from '../../../../app/js/store/sanity'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Sanity Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('isCoreRunning', () => {
    it('returns true if core node status is alive', () => {
      nock('http://localhost:6270')
      .get('/v1/node/ping')
      .reply(200, { status: 'alive' }, { 'Content-Type': 'application/json' })

      const store = mockStore({
      })

      const corePingUrl = 'http://localhost:6270/v1/node/ping'

      return store.dispatch(SanityActions.isCoreRunning(corePingUrl))
      .then(() => {
        const expectedActions = [{ type: 'CORE_IS_RUNNING' }]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })

    it('returns true if core node status is anything besides alive', () => {
      nock('http://localhost:6270')
      .get('/v1/node/ping')
      .reply(200, { status: 'dead' }, { 'Content-Type': 'application/json' })

      const store = mockStore({
      })

      const corePingUrl = 'http://localhost:6270/v1/node/ping'

      return store.dispatch(SanityActions.isCoreRunning(corePingUrl))
      .then(() => {
        const expectedActions = [{ type: 'CORE_IS_NOT_RUNNING' }]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })
})
