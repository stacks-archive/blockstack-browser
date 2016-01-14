import { UPDATE_CURRENT, CREATE_NEW, UPDATE_PROFILE } from '../actions/identities'

const initialState = {
  current: {},
  local: [
    {
      index: 0,
      id: 'ryan.id',
      profile: {},
      verifications: []
    }
  ],
  registered: []
}

export default function Identities(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT:
      return Object.assign({}, state, {
        current: {
          profile: action.profile,
          verifications: action.verifications
        }
      })
    case CREATE_NEW:
      return Object.assign({}, state, {
        local: [
          ...state.local,
          {
            index: state.local.length,
            id: action.id,
            profile: {},
            verifications: []
          }
        ]
      })
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        local: [
          ...state.local.slice(0, action.index),
          Object.assign({}, state.local[action.index], {
            profile: action.profile
          }),
          ...state.local.slice(action.index + 1)
        ]
      })
    default:
      return state
  }
}
