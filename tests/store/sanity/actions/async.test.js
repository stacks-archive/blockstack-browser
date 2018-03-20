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

  describe('isCoreApiPasswordValid', () => {
    it('returns password valid & core running actions if password is valid', () => {
      nock('https://core.blockstack.org',
        {
          reqheaders: {
            authorization: 'bearer secretdonttell'
          }
        })
      .get('/v1/wallet/payment_address')
      .reply(200, { address: '1EZBqbJSHFKSkVPNKzc5v26HA6nAHiTXq6' },
      { 'Content-Type': 'application/json' })

      const store = mockStore({
      })

      const corePasswordProtectedReadUrl = 'https://core.blockstack.org/v1/wallet/payment_address'
      const coreApiPassword = 'secretdonttell'

      return store.dispatch(
        SanityActions.isCoreApiPasswordValid(corePasswordProtectedReadUrl,
          coreApiPassword))
      .then(() => {
        const expectedActions = [
          { type: 'CORE_API_PASSWORD_VALID' },
          { type: 'CORE_IS_RUNNING' }
        ]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })

    it('returns password not valid action if password is wrong', () => {
      nock('https://core.blockstack.org')
      .get('/v1/wallet/payment_address')
      .reply(403, { },
      { 'Content-Type': 'application/json' })

      const store = mockStore({
      })

      const corePasswordProtectedReadUrl = 'https://core.blockstack.org/v1/wallet/payment_address'
      const coreApiPassword = 'rightpassword'

      return store.dispatch(
        SanityActions.isCoreApiPasswordValid(corePasswordProtectedReadUrl,
          coreApiPassword))
      .then(() => {
        const expectedActions = [
          { type: 'CORE_API_PASSWORD_NOT_VALID' }
        ]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })

    it('returns password not valid action if password is null', () => {
      nock('https://core.blockstack.org',
        {
          reqheaders: {
            authorization: 'bearer secretdonttell'
          }
        })
      .get('/v1/wallet/payment_address')
      .reply(200, { address: '1EZBqbJSHFKSkVPNKzc5v26HA6nAHiTXq6' },
      { 'Content-Type': 'application/json' })

      const store = mockStore({
      })

      const corePasswordProtectedReadUrl = 'https://core.blockstack.org/v1/wallet/payment_address'
      const coreApiPassword = null

      return store.dispatch(
        SanityActions.isCoreApiPasswordValid(corePasswordProtectedReadUrl,
          coreApiPassword))
      .then(() => {
        const expectedActions = [
          { type: 'CORE_API_PASSWORD_NOT_VALID' }
        ]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })

  it('returns password not valid action if password is empty string', () => {
    nock('https://core.blockstack.org',
      {
        reqheaders: {
          authorization: 'bearer secretdonttell'
        }
      })
    .get('/v1/wallet/payment_address')
    .reply(200, { address: '1EZBqbJSHFKSkVPNKzc5v26HA6nAHiTXq6' },
    { 'Content-Type': 'application/json' })

    const store = mockStore({
    })

    const corePasswordProtectedReadUrl = 'https://core.blockstack.org/v1/wallet/payment_address'
    const coreApiPassword = ''

    return store.dispatch(
      SanityActions.isCoreApiPasswordValid(corePasswordProtectedReadUrl,
        coreApiPassword))
    .then(() => {
      const expectedActions = [
        { type: 'CORE_API_PASSWORD_NOT_VALID' }
      ]
      assert.deepEqual(store.getActions(), expectedActions)
    })
  })

  it('returns password not valid action if password is undefined', () => {
    nock('https://core.blockstack.org',
      {
        reqheaders: {
          authorization: 'bearer secretdonttell'
        }
      })
    .get('/v1/wallet/payment_address')
    .reply(200, { address: '1EZBqbJSHFKSkVPNKzc5v26HA6nAHiTXq6' },
    { 'Content-Type': 'application/json' })

    const store = mockStore({
    })

    const corePasswordProtectedReadUrl = 'https://core.blockstack.org/v1/wallet/payment_address'
    const coreApiPassword = undefined

    return store.dispatch(
      SanityActions.isCoreApiPasswordValid(corePasswordProtectedReadUrl,
        coreApiPassword))
    .then(() => {
      const expectedActions = [
        { type: 'CORE_API_PASSWORD_NOT_VALID' }
      ]
      assert.deepEqual(store.getActions(), expectedActions)
    })
  })

  describe('isCoreRunning', () => {
    it('returns true if core node status is alive', () => {
      nock('https://core.blockstack.org')
      .get('/v1/node/ping')
      .reply(200, { status: 'alive' }, { 'Content-Type': 'application/json' })

      const store = mockStore({
      })

      const corePingUrl = 'https://core.blockstack.org/v1/node/ping'

      return store.dispatch(SanityActions.isCoreRunning(corePingUrl))
      .then(() => {
        const expectedActions = [{ type: 'CORE_IS_RUNNING' }]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })

    it('returns true if core node status is anything besides alive', () => {
      nock('https://core.blockstack.org')
      .get('/v1/node/ping')
      .reply(200, { status: 'dead' }, { 'Content-Type': 'application/json' })

      const store = mockStore({
      })

      const corePingUrl = 'https://core.blockstack.org/v1/node/ping'

      return store.dispatch(SanityActions.isCoreRunning(corePingUrl))
      .then(() => {
        const expectedActions = [{ type: 'CORE_IS_NOT_RUNNING' }]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })
})
