import { PrivateKeychain, PublicKeychain } from 'blockstack-keychains'
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

export function verifyTokenRecord(tokenRecord, publicKeyOrKeychain) {
  if (publicKeyOrKeychain === null) {
    throw new Error('A public key or keychain is required')
  }

  let token = tokenRecord.token
  let verifyingPublicKey

  if (typeof publicKeyOrKeychain === 'string') {
    verifyingPublicKey = publicKeyOrKeychain
  } else if (publicKeyOrKeychain instanceof PublicKeychain) {
    let childKeychain = publicKeyOrKeychain.child(
      new Buffer(tokenRecord.derivationEntropy, 'hex'))
    verifyingPublicKey = childKeychain.publicKey('hex')
  } else {
    throw new Error('A valid public key or PublicKeychain object is required')
  }

  let decodedToken = verifyToken(token, verifyingPublicKey)

  return decodedToken
}

export function getProfileFromTokens(tokenRecords, publicKeychain) {
  console.log('get profile from tokens')

  let profile = {}

  tokenRecords.map((tokenRecord) => {
    let token = tokenRecord.token,
        decodedToken = null

    try {
      decodedToken = decodeToken(tokenRecord.token)
      decodedToken = verifyTokenRecord(tokenRecord, publicKeychain)
    } catch (e) {
      // pass
      console.log(e)
    }

    if (decodedToken !== null) {
      profile = Object.assign({}, profile, decodedToken.payload.claim)
    }
  })

  return profile
}
