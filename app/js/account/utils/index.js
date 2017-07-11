import { uploadPhotoToDropbox, uploadProfileToDropbox } from './dropbox'
import { uploadPhotoToS3, uploadProfileToS3 } from './s3'
import { uploadPhotoToBlockstackInc, uploadProfileToBlockstackInc } from './blockstack-inc'

export const SELF_HOSTED_S3 = "self-hosted-S3",
  BLOCKSTACK_INC = "blockstack-labs-S3",
  DROPBOX = "dropbox"

export function uploadPhoto(api, name, photoFile, index) {
  const storageMethod = getStorageMethod(api)

  switch(storageMethod) {
    case DROPBOX:
    return uploadPhotoToDropbox(api, name, photoFile, index)

    // case SELF_HOSTED_S3:
    // return uploadPhotoToS3(api, name, photoFile, index)

    default:
    return uploadPhotoToBlockstackInc(api, name, photoFile, index)
  }
}

export function uploadProfile(api, name, signedProfileTokenData, firstUpload=false) {
  const storageMethod = getStorageMethod(api)

  switch(storageMethod) {
    case DROPBOX:
      return uploadProfileToDropbox(api, name, signedProfileTokenData, firstUpload)

    // case SELF_HOSTED_S3:
    // return uploadProfileToS3(api, name, signedProfileTokenData)

    default:
      return uploadProfileToBlockstackInc(api, name, signedProfileTokenData)
  }
}


function getStorageMethod(api) {
  if(api.hostedDataLocation === DROPBOX &&
    api.dropboxAccessToken.length > 0) {
      return DROPBOX
    }

  if(api.hostedDataLocation === SELF_HOSTED_S3 &&
    api.s3ApiKey.length > 0 &&
    api.s3ApiSecret.length > 0 &&
    api.s3Bucket.length > 0) {
      return SELF_HOSTED_S3
    }

  return BLOCKSTACK_INC
}
