import { Person, flattenObject } from 'blockchain-profile'

export const UPDATE_CURRENT = 'UPDATE_CURRENT'
export const CREATE_NEW = 'CREATE_NEW'
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
    type: CREATE_NEW,
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

export function fetchCurrentIdentity(name, nameLookupUrl) {
  return dispatch => {
    const username = name.replace('.id', ''),
          url = nameLookupUrl.replace('{name}', username),
          _this = this
    console.log(url)
    fetch(url)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJson) => {
        const legacyProfile = responseJson[username]['profile'],
              verifications = responseJson[username]['verifications'],
              profile = Person.fromLegacyFormat(legacyProfile).profile
        dispatch(updateCurrentIdentity(profile, verifications))
      })
      .catch((error) => {
        console.warn(error)
      })
  }
}