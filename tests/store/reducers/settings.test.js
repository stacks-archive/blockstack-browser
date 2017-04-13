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
})
