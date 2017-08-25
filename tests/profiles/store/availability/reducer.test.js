import {
  AvailabilityActions, AvailabilityReducer
} from '../../../../app/js/profiles/store/availability'

const initialState = {
  names: {},
  lastNameEntered: null
}

describe('Availability Store: AvailabilityReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      AvailabilityReducer(undefined, {}),
      initialState)
  })

  it('should indicate checking name availability is in progress', () => {
    const action = AvailabilityActions.checkingNameAvailability('satoshi.id')
    const expectedState = {
      names: {
        'satoshi.id': {
          checkingAvailability: true,
          available: false,
          checkingPrice: false,
          price: 0.0,
          error: null
        }
      },
      lastNameEntered: 'satoshi'
    }
    const actualState = AvailabilityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate the name is available', () => {
    const action = AvailabilityActions.nameAvailable('satoshi.id')
    const expectedState = {
      names: {
        'satoshi.id': {
          checkingAvailability: false,
          available: true
        }
      },
      lastNameEntered: 'satoshi.id'
    }
    const actualState = AvailabilityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate the name is unavailable', () => {
    const action = AvailabilityActions.nameUnavailable('satoshi.id')
    const expectedState = {
      names: {
        'satoshi.id': {
          checkingAvailability: false,
          available: false
        }
      },
      lastNameEntered: null
    }
    const actualState = AvailabilityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate there was an error checking name availability', () => {
    const action = AvailabilityActions.nameAvailabilityError('satoshi.id', 'oops!')
    const expectedState = {
      names: {
        'satoshi.id': {
          checkingAvailability: false,
          error: 'oops!'
        }
      },
      lastNameEntered: null
    }
    const actualState = AvailabilityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate checking name price is in progress', () => {
    const action = AvailabilityActions.checkingNamePrice('satoshi.id')
    const expectedState = {
      names: {
        'satoshi.id': {
          checkingPrice: true
        }
      },
      lastNameEntered: null
    }
    const actualState = AvailabilityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate the price of the name', () => {
    const action = AvailabilityActions.namePrice('satoshi.id', 1.23)
    const expectedState = {
      names: {
        'satoshi.id': {
          checkingPrice: false,
          price: 1.23
        }
      },
      lastNameEntered: null
    }
    const actualState = AvailabilityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should indicate there was an error checking name pricing', () => {
    const action = AvailabilityActions.namePriceError('satoshi.id', 'oops!')
    const expectedState = {
      names: {
        'satoshi.id': {
          checkingPrice: false,
          error: 'oops!'
        }
      },
      lastNameEntered: null
    }
    const actualState = AvailabilityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })
})
