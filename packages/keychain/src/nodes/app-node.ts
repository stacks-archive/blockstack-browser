import { BIP32Interface } from 'bip32'
import { getAddress } from '../utils'

export default class AppNode {
  hdNode: BIP32Interface

  appDomain: string

  constructor(hdNode: BIP32Interface, appDomain: string) {
    this.hdNode = hdNode
    this.appDomain = appDomain
  }

  getAppPrivateKey() {
    if (!this.hdNode.privateKey) {
      throw new Error('Node does not have private key')
    }
    return this.hdNode.privateKey.toString('hex')
  }

  getAddress() {
    return getAddress(this.hdNode)
  }
}
