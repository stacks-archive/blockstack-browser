import { BIP32Interface } from 'bip32'
import { address, networks, crypto } from 'bitcoinjs-lib'
import { createHash } from 'crypto-browserify'
import IdentityAddressOwnerNode from './nodes/identity-address-owner-node'

const IDENTITY_KEYCHAIN = 888
const BLOCKSTACK_ON_BITCOIN = 0
export function getIdentityPrivateKeychain(masterKeychain: BIP32Interface) {
  return masterKeychain
    .deriveHardened(IDENTITY_KEYCHAIN)
    .deriveHardened(BLOCKSTACK_ON_BITCOIN)
}

const EXTERNAL_ADDRESS = 'EXTERNAL_ADDRESS'
const CHANGE_ADDRESS = 'CHANGE_ADDRESS'

export function getBitcoinPrivateKeychain(masterKeychain: BIP32Interface) {
  const BIP_44_PURPOSE = 44
  const BITCOIN_COIN_TYPE = 0
  const ACCOUNT_INDEX = 0

  return masterKeychain
    .deriveHardened(BIP_44_PURPOSE)
    .deriveHardened(BITCOIN_COIN_TYPE)
    .deriveHardened(ACCOUNT_INDEX)
}

export function getBitcoinAddressNode(
  bitcoinKeychain: BIP32Interface,
  addressIndex = 0,
  chainType = EXTERNAL_ADDRESS
) {
  let chain = null

  if (chainType === EXTERNAL_ADDRESS) {
    chain = 0
  } else if (chainType === CHANGE_ADDRESS) {
    chain = 1
  } else {
    throw new Error('Invalid chain type')
  }

  return bitcoinKeychain.derive(chain).derive(addressIndex)
}

export function getIdentityOwnerAddressNode(
  identityPrivateKeychain: BIP32Interface,
  identityIndex = 0
) {
  if (identityPrivateKeychain.isNeutered()) {
    throw new Error('You need the private key to generate identity addresses')
  }

  const publicKeyHex = identityPrivateKeychain
    .publicKey
    .toString('hex')
  const salt = createHash('sha256')
    .update(publicKeyHex)
    .digest('hex')

  return new IdentityAddressOwnerNode(
    identityPrivateKeychain.deriveHardened(identityIndex),
    salt
  )
}

// HDNode is no longer a part of bitcoinjs-lib
// This function is taken from https://github.com/bitcoinjs/bitcoinjs-lib/pull/1073/files#diff-1f03b6ff764c499bfbdf841bf8fc113eR10
export function getAddress(node: BIP32Interface) {
  return address.toBase58Check(
    crypto.hash160(node.publicKey),
    networks.bitcoin.pubKeyHash
  )
}

export function hashCode(string: string) {
  let hash = 0
  if (string.length === 0) return hash
  for (let i = 0; i < string.length; i++) {
    const character = string.charCodeAt(i)
    hash = (hash << 5) - hash + character
    hash &= hash
  }
  return hash & 0x7fffffff
}

export interface IdentityKeyPair {
  key: string
  keyID: string
  address: string
  appsNodeKey: string
  salt: string
}

export function deriveIdentityKeyPair(identityOwnerAddressNode: IdentityAddressOwnerNode): IdentityKeyPair {
  const address = identityOwnerAddressNode.getAddress()
  const identityKey = identityOwnerAddressNode.getIdentityKey()
  const identityKeyID = identityOwnerAddressNode.getIdentityKeyID()
  const appsNode = identityOwnerAddressNode.getAppsNode()
  const keyPair = {
    key: identityKey,
    keyID: identityKeyID,
    address,
    appsNodeKey: appsNode.toBase58(),
    salt: appsNode.getSalt()
  }
  return keyPair
}

export function getBlockchainIdentities(
  masterKeychain: BIP32Interface, 
  identitiesToGenerate: number) {
  const identityPrivateKeychainNode = getIdentityPrivateKeychain(
    masterKeychain
  )
  const bitcoinPrivateKeychainNode = getBitcoinPrivateKeychain(
    masterKeychain
  )

  const identityPublicKeychainNode = identityPrivateKeychainNode.neutered()
  const identityPublicKeychain = identityPublicKeychainNode.toBase58()

  const bitcoinPublicKeychainNode = bitcoinPrivateKeychainNode.neutered()
  const bitcoinPublicKeychain = bitcoinPublicKeychainNode.toBase58()

  const firstBitcoinAddress = getAddress(getBitcoinAddressNode(bitcoinPublicKeychainNode))

  const identityAddresses = []
  const identityKeypairs = []

  // We pre-generate a number of identity addresses so that we
  // don't have to prompt the user for the password on each new profile
  for (
    let addressIndex = 0;
    addressIndex < identitiesToGenerate;
    addressIndex++
  ) {
    const identityOwnerAddressNode = getIdentityOwnerAddressNode(
      identityPrivateKeychainNode,
      addressIndex
    )
    const identityKeyPair = deriveIdentityKeyPair(
      identityOwnerAddressNode
    )
    identityKeypairs.push(identityKeyPair)
    identityAddresses.push(
      identityKeyPair.address
    )
  }

  return {
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityAddresses,
    identityKeypairs
  }
}
