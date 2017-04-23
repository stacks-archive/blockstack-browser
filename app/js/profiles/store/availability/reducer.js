import * as types from './types'

const initialState = {
  names: {},
  lastNameEntered: null
}

function AvailabilityReducer(state = initialState, action) {
  switch (action.type) {
    case types.CHECKING_NAME_AVAILABILITY: {
      return Object.assign({}, state, {
        names: Object.assign({}, state.names, {
          [action.domainName]: Object.assign({}, state.names[action.domainName], {
            checkingAvailability: true,
            available: false,
            checkingPrice: true,
            price: 0.0,
            error: null
          })
        }),
        lastNameEntered: action.domainName
      })
    }
    case types.NAME_AVAILABLE:
      return Object.assign({}, state, {
        names: Object.assign({}, state.names, {
          [action.domainName]: Object.assign({}, state.names[action.domainName], {
            checkingAvailability: false,
            available: true
          })
        }),
        lastNameEntered: action.domainName
      })
    case types.NAME_UNAVAILABLE:
      return Object.assign({}, state, {
        names: Object.assign({}, state.names, {
          [action.domainName]: Object.assign({}, state.names[action.domainName],
            {
              checkingAvailability: false,
              available: false
            })
        }),
        lastNameEntered: state.lastNameEntered
      })
    case types.NAME_AVAILABILITIY_ERROR:
      return Object.assign({}, state, {
        names: Object.assign({}, state.names, {
          [action.domainName]: Object.assign({}, state.names[action.domainName],
            {
              checkingAvailability: false,
              error: action.error
            })
        }),
        lastNameEntered: state.lastNameEntered
      })
    case types.CHECKING_NAME_PRICE:
      return Object.assign({}, state, {
        names: Object.assign({}, state.names, {
          [action.domainName]: Object.assign({}, state.names[action.domainName],
            {
              checkingPrice: true
            })
        }),
        lastNameEntered: state.lastNameEntered
      })
    case types.NAME_PRICE:
      return Object.assign({}, state, {
        names: Object.assign({}, state.names, {
          [action.domainName]: Object.assign({}, state.names[action.domainName],
            {
              checkingPrice: false,
              price: action.price
            })
        }),
        lastNameEntered: state.lastNameEntered
      })
    case types.NAME_PRICE_ERROR:
      return Object.assign({}, state, {
        names: Object.assign({}, state.names, {
          [action.domainName]: Object.assign({}, state.names[action.domainName],
            {
              checkingPrice: false,
              error: action.error
            })
        }),
        lastNameEntered: state.lastNameEntered
      })
    default:
      return state
  }
}

export default AvailabilityReducer
