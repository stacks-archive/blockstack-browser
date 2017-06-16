import { HDNode } from 'bitcoinjs-lib'
import bip39 from 'bip39'
import {
  getIdentityPrivateKeychain,
  getIdentityOwnerAddressNode
 } from '../../app/js/utils'

let masterKeychain = null

describe('account-utils', () => {
  beforeEach(() => {
    const backupPhrase = 'sound idle panel often situate develop unit text design antenna vendor screen opinion balcony share trigger accuse scatter visa uniform brass update opinion media'
    const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
    masterKeychain = HDNode.fromSeedBuffer(seedBuffer)
  })

  afterEach(() => {
    masterKeychain = null
  })

  describe('getIdentityOwnerAddressNode', () => {
    it('should generate app key tree', () => {
      const identityPrivateKeychainNode = getIdentityPrivateKeychain(masterKeychain)
      const addressIndex = 0
      const identityOwnerAddressNode = getIdentityOwnerAddressNode(identityPrivateKeychainNode, addressIndex)
      const expectedSalt = 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
      const actualSalt = identityOwnerAddressNode.getSalt()
      assert.equal(actualSalt, expectedSalt)

      const expectedAddress =  '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk'
      const actualAddress = identityOwnerAddressNode.getAddress()
      assert.equal(actualAddress, expectedAddress)

      const appsNode = identityOwnerAddressNode.getAppsNode()

      const origin = 'https://amazing.app:443'
      const appNode = appsNode.getAppNode(origin)

      const expectedAppNodeAddress = '1A9NEhnXq5jDp9BRT4DrwadRP5jbBK896X'
      const actualAppNodeAddress = appNode.getAddress()
      assert.equal(actualAppNodeAddress, expectedAppNodeAddress)
    })
  })
})
