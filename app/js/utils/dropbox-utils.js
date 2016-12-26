var Dropbox = require('dropbox')


export function uploadPhoto(api, name, file, index) {
  return new Promise((resolve, reject) => {

    var dbx = new Dropbox({ accessToken: api.dropboxAccessToken })
    const path = `/${name}/avatar-${index}`

    // We try to delete any existing photo
    dbx.filesDelete({path: path}).then((response) => {

      uploadPhotoToDropbox(dbx, path, file, resolve, reject)
    })
    .catch((error) => {
      // the file didn't exist
      uploadPhotoToDropbox(dbx, path, file, resolve, reject)
    })
  })
}


function uploadPhotoToDropbox(dbx, path, file, resolve, reject) {
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
