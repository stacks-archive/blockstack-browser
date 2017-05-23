import RootReducer from '../../app/js/store/reducers.js'

describe('Root Store: RootReducer', () => {
  it('should return the correct composed reducers', () => {
    const actualResult = RootReducer(undefined, {})
    assert(actualResult.hasOwnProperty('account'), 'Missing account state.')
    assert(actualResult.hasOwnProperty('auth'), 'Missing auth state.')
    assert(actualResult.hasOwnProperty('profiles'), 'Missing profiles state.')
    assert(actualResult.hasOwnProperty('sanity'), 'Missing sanity state.')
    assert(actualResult.hasOwnProperty('settings'), 'Missing settings state.')
  })
})
