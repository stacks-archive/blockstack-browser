import log4js from 'log4js'
import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'
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

export function connectToBlockstackService(serviceProvider, challengeSignerHex){
  logger.debug(`${serviceProvider}/hub_info`)
  const challengeSigner = new bitcoin.ECPair(
    bigi.fromHex(challengeSignerHex))
  return new Promise((resolve, reject) => {
    fetch(`${serviceProvider}/hub_info`)
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJSON) => {
        const readURL = responseJSON.read_url_prefix
        const challenge = responseJSON.challenge_text
        const digest = bitcoin.crypto.sha256(challenge)
        const signature = challengeSigner.sign(digest)
              .toDER().toString('hex')
        const publickey = challengeSigner.getPublicKeyBuffer()
              .toString('hex')
        const token = Buffer( JSON.stringify(
          { publickey, signature } )).toString('base64')
        const address = challengeSigner.getAddress()
        resolve( { url_prefix : readURL,
                   address,
                   token,
                   server : serviceProvider }
               )})})
}

export function redirectToConnectToBlockstack() {
  const port = location.port === '' ? 80 : location.port
  window.top.location.href = `http://localhost:${port}/account/storage#blockstack`
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
