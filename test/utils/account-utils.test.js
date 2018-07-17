import { HDNode } from 'bitcoinjs-lib'
import bip39 from 'bip39'
import {
  getIdentityPrivateKeychain,
  getIdentityOwnerAddressNode,
  findAddressIndex,
  decryptMasterKeychain,
  encrypt
 } from '../../app/js/utils'

let masterKeychain = null
const backupPhrase = 'sound idle panel often situate develop unit text design antenna vendor screen opinion balcony share trigger accuse scatter visa uniform brass update opinion media'

describe('account-utils', () => {
  beforeEach(() => {
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

  describe('findAddressIndex', () => {
    it('should return the index for the address', () => {
      const address = '155fzsEBHy9Ri2bMQ8uuuR3tv1YzcDywd4'
      const identityAddresses = ['1rfWPdz4YvtnKqCuTcd5pqjemmk34HqnU',
      '155fzsEBHy9Ri2bMQ8uuuR3tv1YzcDywd4']
      const actualResult = findAddressIndex(address, identityAddresses)
      const expectedResult = 1
      assert.equal(actualResult, expectedResult)
    })

    it('should return null if address is not in identity addresses', () => {
      const address = '1uVWPykNnn3r6gupWFBLxC1rHYh7MmsT7'
      const identityAddresses = ['1rfWPdz4YvtnKqCuTcd5pqjemmk34HqnU',
      '155fzsEBHy9Ri2bMQ8uuuR3tv1YzcDywd4']
      const actualResult = findAddressIndex(address, identityAddresses)
      const expectedResult = null
      assert.equal(actualResult, expectedResult)
    })
  })

  describe('decryptMasterKeychain', () => {
    let encryptedBackupPhrase = null
    const password = 'password123'

    beforeEach((done) => {
      encrypt(new Buffer(backupPhrase), password).then(ciphertextBuffer => {
        encryptedBackupPhrase = ciphertextBuffer.toString('hex')
        done()
      })
    })

    afterEach(() => {
      encryptedBackupPhrase = null
    })

    it('should return the decrypted master keychain', (done) => {
      decryptMasterKeychain('password123', encryptedBackupPhrase).then((keychain) => {
        assert.equal(masterKeychain.getIdentifier().toString('hex'), keychain.getIdentifier().toString('hex'))
        done()
      })
    })

    it('should return an error object if something goes wrong', (done) => {
      decryptMasterKeychain('badpass', encryptedBackupPhrase).catch((err) => {
        assert.isTrue(err instanceof Error)
        assert.equal(err.message, 'Incorrect password')
        done()
      })
    })
  })
})
