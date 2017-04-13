import { SettingsReducer, DEFAULT_API } from '../../../app/js/store/settings.js'

describe('SettingsReducer', () => {
  it('should return the initial state', () => {
    assert.deepEqual(
      SettingsReducer(undefined, {}),
      {
        api: DEFAULT_API
      })
  })

  it('should add missing api urls', () => {
    const initialState = {
      api: Object.assign({}, DEFAULT_API)
    }
    delete initialState.api.nameLookupUrl
    assert(initialState.api.nameLookupUrl === undefined)

    assert.deepEqual(
      SettingsReducer(initialState, {}),
      {
        api: DEFAULT_API
      })
  })

  it('should not overwrite existing api urls', () => {
    const initialState = {
      api: Object.assign({}, DEFAULT_API)
    }
    initialState.api.nameLookupUrl = 'test'
    assert(initialState.api.nameLookupUrl === 'test')

    const state = SettingsReducer(initialState, {})
    assert(state.api.nameLookupUrl === 'test')
    assert.notDeepEqual(state,
      {
        api: DEFAULT_API
      })
  })

  it('should not overwrite existing api urls that are null', () => {
    const initialState = {
      api: Object.assign({}, DEFAULT_API)
    }
    initialState.api.s3ApiKey = null
    assert(initialState.api.s3ApiKey === null)

    const state = SettingsReducer(initialState, {})
    assert(state.api.s3ApiKey === null)
    assert.notDeepEqual(state,
      {
        api: DEFAULT_API
      })
  })

  it('should not overwrite existing api urls that are blank strings', () => {
    const initialState = {
      api: Object.assign({}, DEFAULT_API)
    }
    initialState.api.dropboxAccessToken = ''
    assert(initialState.api.dropboxAccessToken === '')

    const state = SettingsReducer(initialState, {})
    assert(state.api.dropboxAccessToken === '')
    assert.notDeepEqual(state,
      {
        api: DEFAULT_API
      })
  })

  it('should update the bitcoin price', () => {
    const action = {
      type: 'UPDATE_BTC_PRICE',
      price: 1234.56
    }
    const state = SettingsReducer(undefined, action)
    assert.equal(state.api.btcPrice, 1234.56)
  })
})
