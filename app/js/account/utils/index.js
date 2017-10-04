import { uploadPhotoToDropbox, uploadProfileToDropbox } from './dropbox'
import { uploadPhotoToGaiaHub, uploadProfileToGaiaHub } from './blockstack-inc'

export const BLOCKSTACK_INC = 'gaia-hub'
export const DROPBOX = 'dropbox'

function getStorageMethod(api) {
  if (api.hostedDataLocation === DROPBOX &&
    api.dropboxAccessToken.length > 0) {
    return DROPBOX
  }

  return BLOCKSTACK_INC
}

export function uploadPhoto(api, name, photoFile, index) {
  const storageMethod = getStorageMethod(api)

  switch (storageMethod) {
    case DROPBOX:
      return uploadPhotoToDropbox(api, name, photoFile, index)
    default:
      return uploadPhotoToGaiaHub(api, name, photoFile, index)
  }
}

export function uploadProfile(api, name, signedProfileTokenData, firstUpload = false) {
  const storageMethod = getStorageMethod(api)

  switch (storageMethod) {
    case DROPBOX:
      return uploadProfileToDropbox(api, name, signedProfileTokenData, firstUpload)

    default:
      return uploadProfileToGaiaHub(api, name, signedProfileTokenData)
  }
}
