const SET_USERNAME = 'HAWK/SET_USERNAME'

const initialState = {
  username: ''
}

const updateUsername = (username) => ({
  type: SET_USERNAME,
  username
})

export const HawkActions = {
  updateUsername
}

export function HawkReducer(state = initialState, action) {
  switch (action.type) {
    case SET_USERNAME:
      return {
        ...state,
        username: action.username
      }
    default:
      return state
  }
}
