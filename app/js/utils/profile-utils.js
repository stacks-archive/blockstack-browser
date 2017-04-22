import { PrivateKeychain, PublicKeychain } from 'blockstack-keychains'
import { signProfileToken, wrapProfileToken } from 'blockstack'
import { decodeToken, TokenSigner, TokenVerifier } from 'jwt-js'

import BigInteger from 'bigi'
import ecurve from 'ecurve'
import { ECPair as ECKeyPair } from 'bitcoinjs-lib'
const secp256k1 = ecurve.getCurveByName('secp256k1')

export function verifyToken(token, verifyingKeyOrAddress) {
  const decodedToken = decodeToken(token),
        payload = decodedToken.payload

  if (!payload.hasOwnProperty('subject')) {
    throw new Error("Token doesn't have a subject")
  }
  if (!payload.subject.hasOwnProperty('publicKey')) {
    throw new Error("Token doesn't have a subject public key")
  }
  if (!payload.hasOwnProperty('issuer')) {
    throw new Error("Token doesn't have an issuer")
  }
  if (!payload.issuer.hasOwnProperty('publicKey')) {
    throw new Error("Token doesn't have an issuer public key")
  }
  if (!payload.hasOwnProperty('claim')) {
    throw new Error("Token doesn't have a claim")
  }

  const issuerPublicKey = payload.issuer.publicKey,
        publicKeyBuffer = new Buffer(issuerPublicKey, 'hex')

  const Q = ecurve.Point.decodeFrom(secp256k1, publicKeyBuffer),
        compressedKeyPair = new ECKeyPair(null, Q, { compressed: true }),
        compressedAddress = compressedKeyPair.getAddress(),
        uncompressedKeyPair = new ECKeyPair(null, Q, { compressed: false }),
        uncompressedAddress = uncompressedKeyPair.getAddress()

  if (verifyingKeyOrAddress === issuerPublicKey) {
    // pass
  } else if (verifyingKeyOrAddress === compressedAddress) {
    // pass
  } else if (verifyingKeyOrAddress === uncompressedAddress) {
    // pass
  } else {
    throw new Error("Token issuer public key does not match the verifying value")
  }

  let tokenVerifier = new TokenVerifier(decodedToken.header.alg, issuerPublicKey)
  if (!tokenVerifier) {
    throw new Error("Invalid token verifier")
  }

  let tokenVerified = tokenVerifier.verify(token)
  if (!tokenVerified) {
    throw new Error("Token verification failed")
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

  let decodedToken = verifyToken(tokenRecord.token, publicKeyOrAddress)

  return decodedToken
}

export function getProfileFromTokens(tokenRecords, publicKeychain) {
  let profile = {}

  tokenRecords.map((tokenRecord) => {
    let token = tokenRecord.token,
        decodedToken = null

    try {
      decodedToken = decodeToken(tokenRecord.token)
      decodedToken = verifyTokenRecord(tokenRecord, publicKeychain)
    } catch (error) {
      console.warn(error)
    }

    if (decodedToken !== null) {
      profile = Object.assign({}, profile, decodedToken.payload.claim)
    }
  })

  return profile
}

export function signProfileForUpload(profile, keypair) {
  const privateKey = keypair.key,
        publicKey = keypair.keyID

  const token = signProfileToken(profile, privateKey, {publicKey: publicKey}),
        tokenRecord = wrapProfileToken(token),
        tokenRecords = [tokenRecord]
  return JSON.stringify(tokenRecords, null, 2)
}

export const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}
