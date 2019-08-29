import { BIP32Interface } from 'bip32'
import { createHash } from 'crypto-browserify'
import { hashCode } from '../utils'
import AppNode from './app-node'

export default class AppsNode {
  hdNode: BIP32Interface

  salt: string

  constructor(appsHdNode: BIP32Interface, salt: string) {
    this.hdNode = appsHdNode
    this.salt = salt
  }

  getNode() {
    return this.hdNode
  }

  getAppNode(appDomain: string) {
    const hash = createHash('sha256')
      .update(`${appDomain}${this.salt}`)
      .digest('hex')
    const appIndex = hashCode(hash)
    const appNode = this.hdNode.deriveHardened(appIndex)
    return new AppNode(appNode, appDomain)
  }

  toBase58() {
    return this.hdNode.toBase58()
  }

  getSalt() {
    return this.salt
  }
}
