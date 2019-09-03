import { BIP32Interface } from 'bip32'
import { getAddress } from '../utils'
import AppsNode from './apps-node'

const APPS_NODE_INDEX = 0
const SIGNING_NODE_INDEX = 1
const ENCRYPTION_NODE_INDEX = 2

export default class IdentityAddressOwnerNode {
  hdNode: BIP32Interface

  salt: string

  constructor(ownerHdNode: BIP32Interface, salt: string) {
    this.hdNode = ownerHdNode
    this.salt = salt
  }

  getNode() {
    return this.hdNode
  }

  getSalt() {
    return this.salt
  }

  getIdentityKey() {
    if (!this.hdNode.privateKey) {
      throw new Error('Node does not have private key')
    }
    return this.hdNode.privateKey.toString('hex')
  }

  getIdentityKeyID() {
    return this.hdNode.publicKey.toString('hex')
  }

  getAppsNode() {
    return new AppsNode(this.hdNode.deriveHardened(APPS_NODE_INDEX), this.salt)
  }

  getAddress() {
    // return this.hdNode.getAddress()
    return getAddress(this.hdNode)
  }

  getEncryptionNode() {
    return this.hdNode.deriveHardened(ENCRYPTION_NODE_INDEX)
  }

  getSigningNode() {
    return this.hdNode.deriveHardened(SIGNING_NODE_INDEX)
  }
}
