import { UPDATE_CURRENT } from '../actions/identities'

const initialState = {
  current: {},
  registered: []
}

function Identities(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT:
      return {
        current: {
          profile: action.profile,
          verifications: action.verifications
        },
        registered: state.registered
      }
    default:
      return state
  }
}

export default Identities