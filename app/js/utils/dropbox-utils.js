var Dropbox = require('dropbox')


export function uploadPhoto(api, name, file, index) {
  return new Promise((resolve, reject) => {
    // We try to delete any existing photo
    deletePhoto(api, name, index).then((response) => {
      uploadPhotoToDropbox(api, name, index, file, resolve, reject)
    })
    .catch((error) => {
      // the file didn't exist
      uploadPhotoToDropbox(api, name, index, file, resolve, reject)
    })
  })
}

export function deletePhoto(api, name, index) {
  var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(name, index)
  return dbx.filesDelete({path: path})
}


function uploadPhotoToDropbox(api, name, index, file, resolve, reject) {
  var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
  const path = getAvatarPath(name, index)
  dbx.filesUpload({path: path, contents: file})
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

function getAvatarPath(name, index) {
  const path = `/${name}/avatar-${index}`
  return path
}

function getProfilePath(name) {
  const path = `/${name}/profile.json`
  return path
}
