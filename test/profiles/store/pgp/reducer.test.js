import { PGPActions, PGPReducer } from '../../../../app/js/profiles/store/pgp'

describe('PGP Store: PGPReducer', () => {
  it('should return the proper initial state', () => {
    const initialState = {
      publicKeys: {}
    }
    assert.deepEqual(
      PGPReducer(undefined, {}),
      initialState)
  })

  it('should set loading indicator to true & reset key state info', () => {
    const initialState = {
      publicKeys: {
        ABCDEF: {
          loading: false,
          key: 'XYZ',
          error: 'An error'
        }
      }
    }
    const action = PGPActions.loadingPGPKey('ABCDEF')
    const actualState = PGPReducer(initialState, action)
    const expectedState = {
      publicKeys: {
        ABCDEF: {
          loading: true,
          key: null,
          error: null
        }
      }
    }
    assert.deepEqual(actualState, expectedState)
  })

  it('should set loading indicator to false & return key', () => {
    const initialState = {
      publicKeys: {
        ABCDEF: {
          loading: true,
          key: null,
          error: 'An error'
        }
      }
    }
    const action = PGPActions.loadedPGPKey('ABCDEF', 'XYZ')
    const actualState = PGPReducer(initialState, action)
    const expectedState = {
      publicKeys: {
        ABCDEF: {
          loading: false,
          key: 'XYZ',
          error: null
        }
      }
    }
    assert.deepEqual(actualState, expectedState)
  })

  it('should set loading indicator to false & return error', () => {
    const initialState = {
      publicKeys: {
        ABCDEF: {
          loading: true,
          key: 'XYZ',
          error: null
        }
      }
    }
    const action = PGPActions.loadingPGPKeyError('ABCDEF', 'Broken!')
    const actualState = PGPReducer(initialState, action)
    const expectedState = {
      publicKeys: {
        ABCDEF: {
          loading: false,
          key: null,
          error: 'Broken!'
        }
      }
    }
    assert.deepEqual(actualState, expectedState)
  })

  it('should load and return key', () => {
    const action1 = PGPActions.loadingPGPKey('ABCDEF')
    const actualState1 = PGPReducer(undefined, action1)
    const expectedState1 = {
      publicKeys: {
        ABCDEF: {
          loading: true,
          key: null,
          error: null
        }
      }
    }
    assert.deepEqual(actualState1, expectedState1)
    const action2 = PGPActions.loadedPGPKey('ABCDEF', 'XYZ')
    const actualState2 = PGPReducer(actualState1, action2)
    const expectedState2 = {
      publicKeys: {
        ABCDEF: {
          loading: false,
          key: 'XYZ',
          error: null
        }
      }
    }
    assert.deepEqual(actualState2, expectedState2)
  })
})
