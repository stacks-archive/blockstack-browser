import log4js from 'log4js'
import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'
const logger = log4js.getLogger('account/utils/blockstack-inc.js')

export function uploadPhotoToGaiaHub(api, name, photoFile, index) {
  const hubConfig = api.gaiaHubConfig
  const filename = `${name}/avatar-${index}`
  return uploadToGaiaHub(hubConfig, filename, photoFile)
}

export function uploadProfileToGaiaHub(api, name, signedProfileTokenData) {
  const hubConfig = api.gaiaHubConfig
  const filename = `${name}.json`
  return uploadToGaiaHub(hubConfig, filename, signedProfileTokenData)
}

export function connectToGaiaHub(serviceProvider, challengeSignerHex){
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

export function redirectToConnectToGaiaHub() {
  const port = location.port === '' ? 80 : location.port
  window.top.location.href = `http://localhost:${port}/account/storage#gaiahub`
}

function uploadToGaiaHub(hubConfig, name, contents){
  return new Promise((resolve, reject) => {
    fetch(`${hubConfig.server}/store/${hubConfig.address}/${name}`,
          { method : 'POST',
            headers: {'Content-Type': 'application/octet-stream',
                    'Authentication': `bearer ${hubConfig.token}`},
            body: contents })
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJSON) => {
        resolve(responseJSON.publicURL)
      })
  })
}
