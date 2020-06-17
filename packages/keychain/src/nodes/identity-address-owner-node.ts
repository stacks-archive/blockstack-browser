import { BIP32Interface } from 'bitcoinjs-lib';
import { getLegacyAppNode } from 'blockstack/lib/wallet';
import { publicKeyToAddress } from 'blockstack/lib/keys';
import { getAddress } from '../utils';

const APPS_NODE_INDEX = 0;
const SIGNING_NODE_INDEX = 1;
const ENCRYPTION_NODE_INDEX = 2;
const STX_NODE_INDEX = 6;

export default class IdentityAddressOwnerNode {
  hdNode: BIP32Interface;

  salt: string;

  constructor(ownerHdNode: BIP32Interface, salt: string) {
    this.hdNode = ownerHdNode;
    this.salt = salt;
  }

  getNode() {
    return this.hdNode;
  }

  getSalt() {
    return this.salt;
  }

  getIdentityKey() {
    if (!this.hdNode.privateKey) {
      throw new Error('Node does not have private key');
    }
    return this.hdNode.privateKey.toString('hex');
  }

  getIdentityKeyID() {
    return this.hdNode.publicKey.toString('hex');
  }

  getAppsNode() {
    return this.hdNode.deriveHardened(APPS_NODE_INDEX);
  }

  getAddress() {
    return getAddress(this.hdNode);
  }

  getEncryptionNode() {
    return this.hdNode.deriveHardened(ENCRYPTION_NODE_INDEX);
  }

  getSigningNode() {
    return this.hdNode.deriveHardened(SIGNING_NODE_INDEX);
  }

  getSTXNode() {
    return this.hdNode.deriveHardened(STX_NODE_INDEX);
  }

  getAppNode(appDomain: string) {
    return getLegacyAppNode(this.hdNode, this.salt, appDomain);
  }

  getAppPrivateKey(appDomain: string) {
    const appNode = this.getAppNode(appDomain);
    if (!appNode.privateKey) {
      throw new Error('App node does not have private key');
    }
    return appNode.privateKey.toString('hex');
  }

  getAppAddress(appDomain: string) {
    const appNode = this.getAppNode(appDomain);
    return publicKeyToAddress(appNode.publicKey);
  }
}
