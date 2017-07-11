import log4js from 'log4js'
const logger = log4js.getLogger('account/utils/blockstack-inc.js')

// TODO implement
export function uploadPhotoToBlockstackInc(api, name, photoFile, index) {
  throw "Uploading photos to Blockstack Inc not yet implemented"
}

export function uploadProfileToBlockstackInc(api, name, signedProfileTokenData) {
  return new Promise((resolve, reject) => {
    uploadToBlockstackLabsS3(`${name}.json`, signedProfileTokenData, resolve, reject)
  })
}

function uploadToBlockstackLabsS3(filename, data, resolve, reject) {
  fetch('https://api.onename.com/v1/upload', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: filename,
      value: data
    })
  })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('url')) {
        resolve(responseJson.url)
      } else {
        reject(response)
      }
    })
    .catch((error) => {
      logger.error('uploadToBlockstackLabsS3: error uploading', error)
      reject(error)
    })
}
