import { signProfileToken, wrapProfileToken } from 'blockstack'
import { decodeToken, TokenVerifier } from 'jsontokens'

import ecurve from 'ecurve'
import { ECPair as ECKeyPair } from 'bitcoinjs-lib'
const secp256k1 = ecurve.getCurveByName('secp256k1')

export function verifyToken(token, verifyingKeyOrAddress) {
  const decodedToken = decodeToken(token)
  const payload = decodedToken.payload

  if (!payload.hasOwnProperty('subject')) {
    throw new Error('Token doesn\'t have a subject')
  }
  if (!payload.subject.hasOwnProperty('publicKey')) {
    throw new Error('Token doesn\'t have a subject public key')
  }
  if (!payload.hasOwnProperty('issuer')) {
    throw new Error('Token doesn\'t have an issuer')
  }
  if (!payload.issuer.hasOwnProperty('publicKey')) {
    throw new Error('Token doesn\'t have an issuer public key')
  }
  if (!payload.hasOwnProperty('claim')) {
    throw new Error('Token doesn\'t have a claim')
  }

  const issuerPublicKey = payload.issuer.publicKey
  const publicKeyBuffer = new Buffer(issuerPublicKey, 'hex')

  const Q = ecurve.Point.decodeFrom(secp256k1, publicKeyBuffer)
  const compressedKeyPair = new ECKeyPair(null, Q, { compressed: true })
  const compressedAddress = compressedKeyPair.getAddress()
  const uncompressedKeyPair = new ECKeyPair(null, Q, { compressed: false })
  const uncompressedAddress = uncompressedKeyPair.getAddress()

  if (verifyingKeyOrAddress === issuerPublicKey) {
    // pass
  } else if (verifyingKeyOrAddress === compressedAddress) {
    // pass
  } else if (verifyingKeyOrAddress === uncompressedAddress) {
    // pass
  } else {
    throw new Error('Token issuer public key does not match the verifying value')
  }

  const tokenVerifier = new TokenVerifier(decodedToken.header.alg, issuerPublicKey)
  if (!tokenVerifier) {
    throw new Error('Invalid token verifier')
  }

  const tokenVerified = tokenVerifier.verify(token)
  if (!tokenVerified) {
    throw new Error('Token verification failed')
  }

  return decodedToken
}

export function verifyTokenRecord(tokenRecord, publicKeyOrAddress) {
  if (publicKeyOrAddress === null) {
    throw new Error('A public key or keychain is required')
  }

  if (typeof publicKeyOrAddress === 'string') {
    // do nothing
  } else {
    throw new Error('A valid address or public key is required')
  }

  const decodedToken = verifyToken(tokenRecord.token, publicKeyOrAddress)

  return decodedToken
}

export function getProfileFromTokens(tokenRecords, publicKeychain, silentVerify = true) {
  let profile = {}

  tokenRecords.map(tokenRecord => {
    let decodedToken = null

    try {
      decodedToken = decodeToken(tokenRecord.token)
      decodedToken = verifyTokenRecord(tokenRecord, publicKeychain)
    } catch (error) {
      if (!silentVerify) {
        throw error
      } else {
        console.warn(error)
      }
    }

    if (decodedToken !== null) {
      profile = Object.assign({}, profile, decodedToken.payload.claim)
    }

    return null
  })

  return profile
}

export function signProfileForUpload(profile, keypair) {
  const privateKey = keypair.key
  const publicKey = keypair.keyID

  const token = signProfileToken(profile, privateKey, { publicKey })
  const tokenRecord = wrapProfileToken(token)
  const tokenRecords = [tokenRecord]
  return JSON.stringify(tokenRecords, null, 2)
}

export const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}
