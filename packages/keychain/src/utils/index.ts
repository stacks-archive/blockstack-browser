import { BIP32Interface } from 'bitcoinjs-lib'
import IdentityAddressOwnerNode from '../nodes/identity-address-owner-node'
import { createSha2Hash } from 'blockstack/lib/encryption/sha2Hash'
import { publicKeyToAddress } from 'blockstack/lib/keys'
import Identity from '../identity'

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

export async function getIdentityOwnerAddressNode(
  identityPrivateKeychain: BIP32Interface,
  identityIndex = 0
) {
  if (identityPrivateKeychain.isNeutered()) {
    throw new Error('You need the private key to generate identity addresses')
  }

  const publicKeyHex = Buffer.from(identityPrivateKeychain
    .publicKey
    .toString('hex'))

  const sha2Hash = await createSha2Hash()
  const saltData = await sha2Hash.digest(publicKeyHex, 'sha256')
  const salt = saltData.toString('hex')

  return new IdentityAddressOwnerNode(
    identityPrivateKeychain.deriveHardened(identityIndex),
    salt
  )
}

export async function getAddress(node: BIP32Interface) {
  return publicKeyToAddress(node.publicKey)
}

export interface IdentityKeyPair {
  key: string
  keyID: string
  address: string
  appsNodeKey: string
  salt: string
}

export async function deriveIdentityKeyPair(identityOwnerAddressNode: IdentityAddressOwnerNode): Promise<IdentityKeyPair> {
  const address = await identityOwnerAddressNode.getAddress()
  const identityKey = identityOwnerAddressNode.getIdentityKey()
  const identityKeyID = identityOwnerAddressNode.getIdentityKeyID()
  const appsNode = identityOwnerAddressNode.getAppsNode()
  const keyPair = {
    key: identityKey,
    keyID: identityKeyID,
    address,
    appsNodeKey: appsNode.toBase58(),
    salt: identityOwnerAddressNode.getSalt()
  }
  return keyPair
}

export async function getBlockchainIdentities(
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

  const firstBitcoinAddress = await getAddress(getBitcoinAddressNode(bitcoinPublicKeychainNode))

  const identityAddresses: string[] = []
  const identityKeypairs = []
  const identities: Identity[] = []

  // We pre-generate a number of identity addresses so that we
  // don't have to prompt the user for the password on each new profile
  for (
    let addressIndex = 0;
    addressIndex < identitiesToGenerate;
    addressIndex++
  ) {
    const identity = await makeIdentity(masterKeychain, addressIndex)
    identities.push(identity)
    identityKeypairs.push(identity.keyPair)
    identityAddresses.push(identity.address)
  }

  return {
    identityPublicKeychain,
    bitcoinPublicKeychain,
    firstBitcoinAddress,
    identityAddresses,
    identityKeypairs,
    identities
  }
}

export const makeIdentity = async (masterKeychain: BIP32Interface, index: number) => {
  const identityPrivateKeychainNode = getIdentityPrivateKeychain(
    masterKeychain
  )
  const identityOwnerAddressNode = await getIdentityOwnerAddressNode(
    identityPrivateKeychainNode,
    index
  )
  const identityKeyPair = await deriveIdentityKeyPair(
    identityOwnerAddressNode
  )
  const identity = new Identity({
    keyPair: identityKeyPair,
    address: identityKeyPair.address,
    usernames: [],
  })
  return identity
}
