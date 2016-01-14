import { Person, flattenObject } from 'blockchain-profile'

export const UPDATE_CURRENT = 'UPDATE_CURRENT'
export const ADD_PREORDER = 'ADD_PREORDER'
export const UPDATE_PROFILE = 'UPDATE_PROFILE'

export function updateCurrentIdentity(profile, verifications) {
  return {
    type: UPDATE_CURRENT,
    profile: profile,
    verifications: verifications
  }
}

export function createNewIdentity(id) {
  return {
    type: ADD_PREORDER,
    id: id
  }
}

export function updateProfile(index, profile) {
  return {
    type: UPDATE_PROFILE,
    index: index,
    profile: profile
  }
}

export function fetchCurrentIdentity(name) {
  return dispatch => {
    var username = name.replace('.id', '')
    var url = 'http://resolver.onename.com/v2/users/' + username
    var _this = this
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        var legacyProfile = responseJson[username]['profile'],
            verifications = responseJson[username]['verifications'],
            profile = Person.fromLegacyFormat(legacyProfile).profile
        dispatch(updateCurrentIdentity(profile, verifications))
      })
      .catch((error) => {
        console.warn(error)
      })
  }
}