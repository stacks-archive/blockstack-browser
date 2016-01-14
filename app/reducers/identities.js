import { UPDATE_CURRENT, ADD_PREORDER, UPDATE_PROFILE } from '../actions/identities'

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
    case ADD_PREORDER:
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
    case UPDATE_PROFILE:
      return Object.assign({}, state, {
        preordered: [
          ...state.preordered.slice(0, action.index),
          Object.assign({}, state.preordered[action.index], {
            profile: action.profile
          }),
          ...state.preordered.slice(action.index + 1)
        ]
      })
    default:
      return state
  }
}
