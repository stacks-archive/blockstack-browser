import { UPDATE_CURRENT, CREATE_NEW } from '../actions/identities'

const initialState = {
  current: {},
  preordered: [
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
        preordered: [
          ...state.preordered,
          {
            index: state.preordered.length,
            id: action.id,
            profile: {},
            verifications: []
          }
        ]
      })
    default:
      return state
  }
}
