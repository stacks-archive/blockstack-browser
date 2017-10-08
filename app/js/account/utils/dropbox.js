import Dropbox from 'dropbox'
import log4js from 'log4js'

const logger = log4js.getLogger('account/utils/dropbox.js')

export const DROPBOX_APP_ID = 'f3l2g7ge4bs68o4'

export function redirectToConnectToDropbox() {
  const dbx = new Dropbox({ clientId: DROPBOX_APP_ID })
  const port = location.port === '' ? 80 : location.port
  console.log(port)
  window.location = dbx.getAuthenticationUrl(
    `http://localhost:${port}/account/storage`)
}

function getAvatarPath(domainName, index) {
  const path = `/${domainName}/avatar-${index}`
  return path
}

function getProfilePath(domainName) {
  const path = `/${domainName}/profile.json`
  return path
}

function deleteProfile(api, domainName) {
  const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getProfilePath(domainName)
  return dbx.filesDelete({ path })
}

function uploadProfile(api, domainName, signedProfileTokenData, resolve, reject, firstUpload) {
  const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getProfilePath(domainName)
  dbx.filesUpload({ path, contents: signedProfileTokenData, mode: 'overwrite' })
  .then((response) => {
    if (firstUpload === true) { // we can only create shared link once
      logger.debug('uploadProfile: first upload: creating shared link')
      dbx.sharingCreateSharedLinkWithSettings({ path: response.path_lower, settings: {} })
      .then((shareLinkResponse) => {
        /* Appending dropbox share url with ?dl=1 returns the actual file
        instead of dropbox sign up page */
        const profileUrl = `${shareLinkResponse.url.split('=')[0]}=1`
        resolve(profileUrl)
      })
      .catch((error) => {
        logger.error('uploadProfile: error creating shared link', error)
        reject(error)
      })
    } else {
      logger.debug('uploadProfile: not first upload - refusing to create shared link')
      resolve(null)
    }
  })
  .catch((error) => {
    reject(error)
  })
}


export function uploadProfileToDropbox(api, domainName,
  signedProfileTokenData, firstUpload = false) {
  return new Promise((resolve, reject) => {
    if (firstUpload === true) { // We try to delete any existing profile file
      deleteProfile(api, domainName).then(() => {
        uploadProfile(api, domainName, signedProfileTokenData, resolve, reject, firstUpload)
      })
      .catch(() => {
        // the file didn't exist
        uploadProfile(api, domainName, signedProfileTokenData, resolve, reject, firstUpload)
      })
    } else {
      uploadProfile(api, domainName, signedProfileTokenData, resolve, reject, firstUpload)
    }
  })
}

function deletePhoto(api, domainName, index) {
  const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(domainName, index)
  return dbx.filesDelete({ path })
}

function uploadPhoto(api, domainName, photoFile, index, resolve, reject) {
  const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(domainName, index)
  dbx.filesUpload({ path, contents: photoFile })
  .then((response) => {
    dbx.sharingCreateSharedLinkWithSettings({ path: response.path_lower, settings: {} })
    .then((shareLinkResponse) => {
      /* Appending dropbox share url with ?dl=1 returns the actual file
      instead of dropbox sign up page */
      const avatarUrl = `${shareLinkResponse.url.split('=')[0]}=1`

      resolve(avatarUrl)
    })
    .catch((error) => {
      reject(error)
    })
  })
  .catch((error) => {
    reject(error)
  })
}

export function uploadPhotoToDropbox(api, domainName, photoFile, index) {
  return new Promise((resolve, reject) => {
    // We try to delete any existing photo
    deletePhoto(api, domainName, index).then(() => {
      uploadPhoto(api, domainName, photoFile, index, resolve, reject)
    })
    .catch(() => {
      // the file didn't exist
      uploadPhoto(api, domainName, photoFile, index, resolve, reject)
    })
  })
}


export function getDropboxAccessTokenFromHash(hash) {
  let tokens = hash.split('access_token=')
  if (tokens.length !== 2) {
    return null
  }

  tokens = tokens[1].split('&')

  if (tokens[0] === '') {
    return null
  }

  return tokens[0]
}
