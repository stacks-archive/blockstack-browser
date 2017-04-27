import {
  SanityActions, SanityReducer
} from '../../../app/js/store/sanity'

describe('Sanity Store: SanityReducer', () => {
  it('should return the proper initial state', () => {
    const initialState = {
      coreApiRunning: false
    }
    assert.deepEqual(
      SanityReducer(undefined, {}),
      initialState)
  })

  it('should indicate core is not running', () => {
    const initialState = {
      coreApiRunning: true
    }
    const action = SanityActions.coreIsNotRunning()
    const expectedState = {
      coreApiRunning: false
    }
    const actualState = SanityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate core is running', () => {
    const initialState = {
      coreApiRunning: false
    }
    const action = SanityActions.coreIsRunning()
    const expectedState = {
      coreApiRunning: true
    }
    const actualState = SanityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })
})
