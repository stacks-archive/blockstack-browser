import { makeECPrivateKey, getPublicKeyFromPrivate } from 'blockstack/lib/keys'
import { decryptPrivateKey } from 'blockstack/lib/auth/authMessages'
import { decodeToken } from 'jsontokens'
import Wallet from '../src/wallet'

const getIdentity = async () => {
  const seed = 'sound idle panel often situate develop unit text design antenna '
    + 'vendor screen opinion balcony share trigger accuse scatter visa uniform brass '
    + 'update opinion media'
  const password = 'password'
  const wallet = await Wallet.restore(password, seed)
  const [identity] = wallet.identities
  return identity
}

interface Decoded {
  [key: string]: any
}

test('generates an auth response', async () => {
  const identity = await getIdentity()
  const appDomain = 'https://banter.pub'
  const gaiaUrl = 'https://hub.blockstack.org'
  const transitPrivateKey = makeECPrivateKey()
  const transitPublicKey = getPublicKeyFromPrivate(transitPrivateKey)
  const authResponse = await identity.makeAuthResponse({ appDomain, gaiaUrl, transitPublicKey })
  const decoded = decodeToken(authResponse)
  const { payload } = decoded as Decoded
  expect(payload.profile_url).toEqual(
    'https://gaia.blockstack.org/hub/1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk/profile.json'
  )
  const appPrivateKey = await decryptPrivateKey(transitPrivateKey, payload.private_key)
  const expectedKey =
    '6f8b6a170f8b2ee57df5ead49b0f4c8acde05f9e1c4c6ef8223d6a42fabfa314'
  expect(appPrivateKey).toEqual(expectedKey)
})

test('generates an app private key', async () => {
  const expectedKey = '6f8b6a170f8b2ee57df5ead49b0f4c8acde05f9e1c4c6ef8223d6a42fabfa314'
  const identity = await getIdentity()
  const appPrivateKey = await identity.appPrivateKey('https://banter.pub')
  expect(appPrivateKey).toEqual(expectedKey)
})

test('gets default profile URL', async () => {
  const identity = await getIdentity()
  const gaiaUrl = 'https://gaia.blockstack.org/hub/'
  expect(await identity.profileUrl(gaiaUrl)).toEqual('https://gaia.blockstack.org/hub/1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk/profile.json')
})
