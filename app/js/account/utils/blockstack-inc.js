// @flow
import log4js from 'log4js'
import bitcoin from 'bitcoinjs-lib'
import bigi from 'bigi'
const logger = log4js.getLogger('account/utils/blockstack-inc.js')

export type GaiaHubConfig = {
  address: string,
  token: string,
  server: string
}

function uploadToGaiaHub(hubConfig: GaiaHubConfig, filename: string, contents: any,
contentType: string = 'application/octet-stream'): Promise<*> {
  return new Promise((resolve) => {
    logger.debug(`uploadToGaiaHub: uploading ${filename} to ${hubConfig.server}`)
    return fetch(`${hubConfig.server}/store/${hubConfig.address}/${filename}`,
          { method: 'POST',
            headers: {
              'Content-Type': contentType,
              Authorization: `bearer ${hubConfig.token}`
            },
            body: contents })
      .then((response) => response.text())
      .then((responseText) => JSON.parse(responseText))
      .then((responseJSON) => {
        resolve(responseJSON.publicURL)
      })
  })
}

export function uploadPhotoToGaiaHub(api: {gaiaHubConfig: GaiaHubConfig },
  identityIndex: number, identityAddress: string, photoFile: any, photoIndex: number) {
  logger.trace('uploadPhotoToGaiaHub')
  const hubConfig = api.gaiaHubConfig
  const filename = `${identityIndex}/avatar-${photoIndex}`
  return uploadToGaiaHub(hubConfig, filename, photoFile)
}

export function uploadProfileToGaiaHub(api: {gaiaHubConfig: GaiaHubConfig},
  identityIndex: number, identityAddress: string, signedProfileTokenData: string) {
  logger.trace('uploadProfileToGaiaHub')
  const hubConfig = api.gaiaHubConfig
  const filename = `${identityIndex}/profile.json`
  return uploadToGaiaHub(hubConfig, filename, signedProfileTokenData, 'application/json')
}

export function connectToGaiaHub(gaiaHubUrl: string, challengeSignerHex: string): Promise<*> {
  logger.debug(`connectToGaiaHub: ${gaiaHubUrl}/hub_info`)
  const challengeSigner = new bitcoin.ECPair(
    bigi.fromHex(challengeSignerHex))
  return new Promise((resolve) => {
    fetch(`${gaiaHubUrl}/hub_info`)
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
        const token = new Buffer(JSON.stringify(
          { publickey, signature })).toString('base64')
        const address = challengeSigner.getAddress()
        resolve({ url_prefix: readURL,
                   address,
                   token,
                   server: gaiaHubUrl }
               ) }) })
}

export function redirectToConnectToGaiaHub() {
  logger.trace('redirectToConnectToGaiaHub')
  const port = location.port === '' ? 80 : location.port
  window.top.location.href = `http://localhost:${port}/account/storage#gaiahub`
}
