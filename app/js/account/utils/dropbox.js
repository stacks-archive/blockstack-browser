// @flow
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

function getAvatarPath(identityIndex: number,
  identityAddress: string, photoIndex: number): string {
  const path = `/${identityAddress}/${identityIndex}/avatar-${photoIndex}`
  return path
}

function getProfilePath(identityIndex: number,
  identityAddress: string): string {
  const path = `/${identityAddress}/${identityIndex}/profile.json`
  return path
}

function deleteProfile(api: {dropboxAccessToken: string}, identityIndex: number,
  identityAddress: string): Promise<*> {
  const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getProfilePath(identityIndex, identityAddress)
  return dbx.filesDelete({ path })
}

function uploadProfile(api: {dropboxAccessToken: string}, identityIndex: number,
  identityAddress: string, signedProfileTokenData: string, firstUpload: boolean): Promise<*> {
  return new Promise((resolve, reject) => {
    const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
    const path = getProfilePath(identityIndex, identityAddress)
    return dbx.filesUpload({ path, contents: signedProfileTokenData, mode: 'overwrite' })
    .then((response) => {
      if (firstUpload === true) { // we can only create shared link once
        logger.debug('uploadProfile: first upload: creating shared link')
        return dbx.sharingCreateSharedLinkWithSettings({ path: response.path_lower, settings: {} })
        .then((shareLinkResponse) => {
          logger.debug(`uploadProfile: shared link: ${shareLinkResponse}`)
          /* Appending dropbox share url with ?dl=1 returns the actual file
          instead of dropbox sign up page */
          const profileUrl = `${shareLinkResponse.url.split('=')[0]}=1`
          resolve(profileUrl)
        })
        .catch((error) => {
          logger.error('uploadProfile: error creating shared link', error)
          reject(error)
          return Promise.reject()
        })
      } else {
        logger.debug('uploadProfile: not first upload - we won\'t create shared link')
        resolve(null)
        return Promise.reject()
      }
    })
    .catch((error) => {
      reject(error)
    })
  })
}


export function uploadProfileToDropbox(api: {dropboxAccessToken: string},
  identityIndex: number, identityAddress: string, signedProfileTokenData: string,
  firstUpload: boolean = false): Promise<*> {
  if (firstUpload === true) { // We try to delete any existing profile file
    return deleteProfile(api, identityIndex, identityAddress)
    .then(() => uploadProfile(api, identityIndex, identityAddress,
        signedProfileTokenData, firstUpload))
    // the profile didn't exist
    .catch(() => uploadProfile(api, identityIndex, identityAddress,
      signedProfileTokenData, firstUpload))
  } else {
    return uploadProfile(api, identityIndex, identityAddress,
      signedProfileTokenData, firstUpload)
  }
}

function deletePhoto(api: {dropboxAccessToken: string}, identityIndex: number,
  identityAddress: string, photoIndex: number): Promise<*> {
  const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(identityIndex, identityAddress, photoIndex)
  return dbx.filesDelete({ path })
}

function uploadPhoto(api: {dropboxAccessToken: string}, identityIndex: number,
  identityAddress: string, photoFile: any, photoIndex: number): Promise<*> {
  const dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(identityIndex, identityAddress, photoIndex)
  return new Promise((resolve, reject) => dbx.filesUpload({ path, contents: photoFile })
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
  }))
}

export function uploadPhotoToDropbox(api: {dropboxAccessToken: string},
  identityIndex: number, identityAddress: string, photoFile: any,
  photoIndex: number): Promise<*> {
  logger.debug(`uploadPhotoToDropbox: id index: ${identityIndex} id address ${identityAddress}`)
  // We try to delete any existing photo
  return deletePhoto(api, identityIndex, identityAddress, photoIndex).then(() =>
     uploadPhoto(api, identityIndex, identityAddress, photoFile, photoIndex))
  // the file didn't exist
  .catch(() => uploadPhoto(api, identityIndex, identityAddress, photoFile, photoIndex))
}


export function getDropboxAccessTokenFromHash(hash: string) {
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
