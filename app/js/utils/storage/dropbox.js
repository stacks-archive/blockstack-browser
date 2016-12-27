var Dropbox = require('dropbox')


export function uploadProfileToDropbox(api, domainName, signedProfileTokenData) {
  return new Promise((resolve, reject) => {
    // We try to delete any existing profile file
    deleteProfile(api, domainName).then((response) => {
      console.log("deleted")
      uploadProfil(api, domainName, signedProfileTokenData, resolve, reject)
    })
    .catch((error) => {
      console.log("nothing to delete")
      // the file didn't exist
      uploadProfile(api, domainName, signedProfileTokenData, resolve, reject)
    })
  })
}

export function uploadPhotoToDropbox(api, domainName, photoFile, index) {
  return new Promise((resolve, reject) => {
    // We try to delete any existing photo
    deletePhoto(api, domainName, index).then((response) => {
      console.log("deleted")
      uploadPhoto(api, domainName, photoFile, index, resolve, reject)
    })
    .catch((error) => {
      console.log("nothing to delete")
      // the file didn't exist
      uploadPhoto(api, domainName, photoFile, index, resolve, reject)
    })
  })
}

function getAvatarPath(domainName, index) {
  const path = `/${domainName}/avatar-${index}`
  return path
}

function getProfilePath(domainName) {
  const path = `/${domainName}/profile.json`
  return path
}

function deletePhoto(api, domainName, index) {
  var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(domainName, index)
  return dbx.filesDelete({path: path})
}

function deleteProfile(api, domainName) {
  var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getProfilePath(domainName)
  return dbx.filesDelete({path: path})
}

function uploadPhoto(api, domainName, photoFile, index, resolve, reject) {
  var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(domainName, index)
  console.log(`uploading: ${path}`)
  dbx.filesUpload({path: path, contents: photoFile})
  .then((response) => {

    dbx.sharingCreateSharedLinkWithSettings({path: response.path_lower, settings: {} })
    .then((response) => {

      /* Appending dropbox share url with ?dl=1 returns the actual file
      instead of dropbox sign up page */
      const avatarUrl = response.url.split("=")[0] + "=1"

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


function uploadProfile(api, domainName, signedProfileTokenData, resolve, reject) {
  var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getProfilePath(domainName)
  dbx.filesUpload({path: path, contents: signedProfileTokenData})
  .then((response) => {

    dbx.sharingCreateSharedLinkWithSettings({path: response.path_lower, settings: {} })
    .then((response) => {

      /* Appending dropbox share url with ?dl=1 returns the actual file
      instead of dropbox sign up page */
      const profileUrl = response.url.split("=")[0] + "=1"
      resolve(profileUrl)
    })
    .catch((error) => {
      reject(error)
    })
  })
  .catch((error) => {
    reject(error)
  })
}
