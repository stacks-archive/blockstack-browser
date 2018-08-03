import {
  SanityActions, SanityReducer
} from '../../../app/js/store/sanity'

describe('Sanity Store: SanityReducer', () => {
  it('should return the proper initial state', () => {
    const initialState = {
      coreApiRunning: false,
      coreApiPasswordValid: false
    }
    assert.deepEqual(
      SanityReducer(undefined, {}),
      initialState)
  })

  it('should indicate core is not running', () => {
    const initialState = {
      coreApiRunning: true,
      coreApiPasswordValid: false
    }
    const action = SanityActions.coreIsNotRunning()
    const expectedState = {
      coreApiRunning: false,
      coreApiPasswordValid: false
    }
    const actualState = SanityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate core is running', () => {
    const initialState = {
      coreApiRunning: false,
      coreApiPasswordValid: false
    }
    const action = SanityActions.coreIsRunning()
    const expectedState = {
      coreApiRunning: true,
      coreApiPasswordValid: false
    }
    const actualState = SanityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate core api password is valid & core is running', () => {
    const initialState = {
      coreApiRunning: false,
      coreApiPasswordValid: false
    }
    const expectedState = {
      coreApiRunning: true,
      coreApiPasswordValid: true
    }
    let action = SanityActions.coreIsRunning()
    let actualState = SanityReducer(initialState, action)
    action = SanityActions.coreApiPasswordIsValid()
    actualState = SanityReducer(actualState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate core api password is invalid & core is running', () => {
    const initialState = {
      coreApiRunning: false,
      coreApiPasswordValid: false
    }
    const expectedState = {
      coreApiRunning: true,
      coreApiPasswordValid: false
    }
    let action = SanityActions.coreIsRunning()
    let actualState = SanityReducer(initialState, action)
    action = SanityActions.coreApiPasswordIsNotValid()
    actualState = SanityReducer(actualState, action)
    assert.deepEqual(actualState, expectedState)
  })
})
