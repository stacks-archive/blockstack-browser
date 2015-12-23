import { UPDATE_CURRENT, CREATE_NEW } from '../actions/identities'

const initialState = {
  current: {},
  preordered: [
    {
      index: 0,
      id: 'ryan.id',
      profile: {},
      verifications: []
    },
    {
      index: 1,
      id: 'muneeb.id',
      profile: {},
      verifications: []
    },
    {
      index: 2,
      id: 'guylepage3.id',
      profile: {},
      verifications: []
    },
    {
      index: 3,
      id: 'judecn.id',
      profile: {},
      verifications: []
    },
    {
      index: 4,
      id: 'naval.id',
      profile: {},
      verifications: []
    },
    {
      index: 5,
      id: 'albertwenger.id',
      profile: {},
      verifications: []
    },
    {
      index: 6,
      id: 'fredwilson.id',
      profile: {},
      verifications: []
    }
  ],
  registered: []
}

export default function Identities(state = initialState, action) {
  switch (action.type) {
    case UPDATE_CURRENT:
      return {
        current: {
          profile: action.profile,
          verifications: action.verifications
        },
        preordered: state.preordered,
        registered: state.registered
      }
    case CREATE_NEW:
      const newIdentity = {
        index: state.preordered.length,
        id: action.id,
        profile: {},
        verifications: []
      }
      return Object.assign({}, state, {
        preordered: [
          ...state.preordered,
          newIdentity
        ]
      })
    default:
      return state
  }
}
