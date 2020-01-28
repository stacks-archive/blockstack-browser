import { TokenSigner } from 'jsontokens'
import { getPublicKeyFromPrivate } from 'blockstack/lib/keys'
import { randomBytes } from 'blockstack/lib/encryption/cryptoRandom'
import { ecPairToAddress, hexStringToECPair } from 'blockstack'
import { GaiaHubConfig } from 'blockstack/lib/storage/hub'

export const DEFAULT_GAIA_HUB = 'https://gaia.blockstack.org/hub/'

interface HubInfo {
  challenge_text?: string
  read_url_prefix: string
}

export const getHubInfo = async (hubUrl: string) => {
  const response = await fetch(`${hubUrl}/hub_info`)
  const data: HubInfo = await response.json()
  return data
}

export const getHubPrefix = async (hubUrl: string) => {
  const { read_url_prefix } = await getHubInfo(hubUrl)
  return read_url_prefix
}

export const makeGaiaAssociationToken = async (secretKeyHex: string, childPublicKeyHex: string): Promise<string> => {
  const LIFETIME_SECONDS = 365 * 24 * 3600
  const signerKeyHex = secretKeyHex.slice(0, 64)
  const compressedPublicKeyHex = getPublicKeyFromPrivate(signerKeyHex)
  const salt = randomBytes(16).toString('hex')
  const payload = {
    childToAssociate: childPublicKeyHex,
    iss: compressedPublicKeyHex,
    exp: LIFETIME_SECONDS + (new Date().getTime() / 1000),
    iat: Date.now() / 1000,
    salt
  }

  const tokenSigner = new TokenSigner('ES256K', signerKeyHex)
  const token = await tokenSigner.sign(payload)
  return token
}

interface ConnectToGaiaOptions {
  hubInfo: HubInfo
  privateKey: string
  gaiaHubUrl: string
}

export const connectToGaiaHubWithConfig = async ({ hubInfo, privateKey, gaiaHubUrl }: ConnectToGaiaOptions): Promise<GaiaHubConfig> => {
  const readURL = hubInfo.read_url_prefix
  const token = makeGaiaAuthToken({ hubInfo, privateKey, gaiaHubUrl })
  const address = await ecPairToAddress(hexStringToECPair(privateKey
                                    + (privateKey.length === 64 ? '01' : '')))
  return {
    url_prefix: readURL,
    address,
    token,
    server: gaiaHubUrl
  }
}

const makeGaiaAuthToken = ({ hubInfo, privateKey, gaiaHubUrl }: ConnectToGaiaOptions) => {
  const challengeText = hubInfo.challenge_text
  const iss = getPublicKeyFromPrivate(privateKey)

  const salt = randomBytes(16).toString('hex')
  const payload = {
    gaiaChallenge: challengeText,
    gaiaHubUrl,
    iss,
    salt
  }
  const token = new TokenSigner('ES256K', privateKey).sign(payload)
  return `v1:${token}`
}
