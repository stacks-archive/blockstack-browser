import { bip32 } from 'bitcoinjs-lib'
import * as bip39 from 'bip39'
import * as blockstack from 'blockstack'
import {
  getIdentityPrivateKeychain,
  getIdentityOwnerAddressNode,
  findAddressIndex,
  decryptMasterKeychain,
  encrypt
 } from '../../app/js/utils'

/** @type {bip32.BIP32Interface} */
let masterKeychain = null
const backupPhrase = 'sound idle panel often situate develop unit text design antenna vendor screen opinion balcony share trigger accuse scatter visa uniform brass update opinion media'

describe('account-utils', () => {
  beforeEach(async () => {
    const seedBuffer = await bip39.mnemonicToSeed(backupPhrase)
    masterKeychain = bip32.fromSeed(seedBuffer)
  })

  afterEach(() => {
    masterKeychain = null
  })

  describe('getIdentityOwnerAddressNode', () => {
    it('should generate app key tree', () => {
      const wallet = new blockstack.BlockstackWallet(masterKeychain)
      const addressIndex = 0
      const identityKeyPair = wallet.getIdentityKeyPair(addressIndex, true)
      const expectedSalt = 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
      const actualSalt = wallet.getIdentitySalt()
      assert.equal(actualSalt, expectedSalt)

      const expectedAddress =  '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk'
      const actualAddress = identityKeyPair.address
      assert.equal(actualAddress, expectedAddress)

      const appsNodeKey = identityKeyPair.appsNodeKey

      const origin = 'https://amazing.app:443'
      const appNodeKey = blockstack.BlockstackWallet.getLegacyAppPrivateKey(appsNodeKey, identityKeyPair.salt, origin)

      const expectedAppNodeAddress = '1A9NEhnXq5jDp9BRT4DrwadRP5jbBK896X'
      const actualAppNodeAddress = blockstack.publicKeyToAddress(blockstack.getPublicKeyFromPrivate(appNodeKey))
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
      encrypt(Buffer.from(backupPhrase), password).then(ciphertextBuffer => {
        encryptedBackupPhrase = ciphertextBuffer.toString('hex')
        done()
      })
    })

    afterEach(() => {
      encryptedBackupPhrase = null
    })

    it('should return the decrypted master keychain', async () => {
      const keychain = await decryptMasterKeychain('password123', encryptedBackupPhrase)
      assert.equal(masterKeychain.identifier.toString('hex'), keychain.identifier.toString('hex'))
    })

    it('should return an error object if something goes wrong', async () => {
      try {
        await decryptMasterKeychain('badpass', encryptedBackupPhrase)
        assert.fail('decrypt with bad pass should have failed')
      } catch (err) {
        assert.isTrue(err instanceof Error)
      }
    })
  })
})
