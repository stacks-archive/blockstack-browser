import { bip32, ECPair } from 'bitcoinjs-lib'
import { getPublicKeyFromPrivate } from 'blockstack/lib/keys'
import { makeAuthResponse } from 'blockstack/lib/auth/authMessages'

import { IdentityKeyPair } from './utils/index'
import { makeGaiaAssociationToken, DEFAULT_GAIA_HUB, getHubInfo, connectToGaiaHubWithConfig } from './utils/gaia'
import IdentityAddressOwnerNode from './nodes/identity-address-owner-node'
import { Profile, fetchProfile, DEFAULT_PROFILE, signAndUploadProfile } from './profiles'
import { ecPairToAddress } from 'blockstack'

interface IdentityConstructorOptions {
  keyPair: IdentityKeyPair
  address: string
  usernames?: string[]
  defaultUsername?: string
  profile?: Profile
}

interface RefreshOptions {
  gaiaUrl: string
}

export default class Identity {
  public keyPair: IdentityKeyPair
  public address: string
  public defaultUsername?: string
  public usernames: string[]
  public profile?: Profile

  constructor({ keyPair, address, usernames, defaultUsername, profile }: IdentityConstructorOptions) {
    this.keyPair = keyPair
    this.address = address
    this.usernames = usernames || []
    this.defaultUsername = defaultUsername
    this.profile = profile
  }

  async makeAuthResponse({ appDomain, gaiaUrl, transitPublicKey, scopes = [] }: { 
    appDomain: string
    gaiaUrl: string
    transitPublicKey: string
    scopes?: string[]
  }) {
    const appPrivateKey = await this.appPrivateKey(appDomain)
    const hubInfo = await getHubInfo(gaiaUrl)
    const profileUrl = await this.profileUrl(hubInfo.read_url_prefix)
    if (scopes.includes('publish_data')) {
      const profile = this.profile || await fetchProfile({ identity: this, gaiaUrl: hubInfo.read_url_prefix }) || DEFAULT_PROFILE
      // console.log(profile)
      if (!profile.apps) {
        profile.apps = {}
      }
      const challengeSigner = ECPair.fromPrivateKey(Buffer.from(appPrivateKey, 'hex'))
      profile.apps[appDomain] = `${hubInfo.read_url_prefix}${await ecPairToAddress(challengeSigner)}`
      const gaiaHubConfig = await connectToGaiaHubWithConfig({
        hubInfo,
        privateKey: this.keyPair.key,
        gaiaHubUrl: gaiaUrl,
      })
      await signAndUploadProfile({ profile, identity: this, gaiaHubUrl: gaiaUrl, gaiaHubConfig })
      this.profile = profile
    }
    // const appBucketUrl = await getAppBucketUrl(gaiaUrl, appPrivateKey)

    const compressedAppPublicKey = getPublicKeyFromPrivate(appPrivateKey.slice(0, 64))
    const associationToken = await makeGaiaAssociationToken(this.keyPair.key, compressedAppPublicKey)

    return makeAuthResponse(
      this.keyPair.key,
      this.profile || {},
      this.defaultUsername || '',
      {
        profileUrl
      },
      undefined,
      appPrivateKey,
      undefined,
      transitPublicKey,
      gaiaUrl,
      undefined,
      associationToken
    )
  }

  async appPrivateKey(appDomain: string) {
    const { salt, appsNodeKey } = this.keyPair
    const appsNode = new IdentityAddressOwnerNode(bip32.fromBase58(appsNodeKey), salt)
    return appsNode.getAppPrivateKey(appDomain)
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async profileUrl(gaiaUrl: string) {
    // future proofing for code that may require network requests to find profile
    return `${gaiaUrl}${this.address}/profile.json`
  }

  async fetchNames() {
    const getNamesUrl = `https://core.blockstack.org/v1/addresses/bitcoin/${this.address}`
    const res = await fetch(getNamesUrl)
    const data = await res.json()
    const { names }: { names: string[]; } = data
    return names
  }

  /**
   * Fetch existing information related to this identity, like username and profile information
   */
  async refresh(opts: RefreshOptions = { gaiaUrl: DEFAULT_GAIA_HUB }) {
    try {
      const [names, profile] = await Promise.all([
        this.fetchNames(),
        fetchProfile({ identity: this, gaiaUrl: opts.gaiaUrl })
      ])
      if (names) {
        if (names[0] && !this.defaultUsername) {
          this.defaultUsername = names[0]
        }
        names.forEach((name) => {
          const existingIndex = this.usernames.findIndex(u => u === name)
          if (existingIndex === -1) {
            this.usernames.push(name)
          }
        })
      }
      if (profile) {
        this.profile = profile
      }
      return
    } catch (error) {
      return
    }
  }
}
