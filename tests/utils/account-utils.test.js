import { HDNode } from 'bitcoinjs-lib'
import bip39 from 'bip39'
import {
  findAddressIndex,
  decryptKeychain,
  encrypt
 } from '../../app/js/utils'

import { BlockstackWallet, hexStringToECPair } from 'blockstack'

let seedBuffer = null
let masterKeychain = null
const backupPhrase = 'sound idle panel often situate develop unit text design antenna vendor screen opinion balcony share trigger accuse scatter visa uniform brass update opinion media'

describe('account-utils', () => {
  beforeEach(() => {
    seedBuffer = bip39.mnemonicToSeed(backupPhrase)
    masterKeychain = HDNode.fromSeedBuffer(seedBuffer)
  })

  afterEach(() => {
    masterKeychain = null
  })

  describe('getIdentityOwnerAddressNode', () => {
    it('should generate app key tree', () => {
      const wallet = new BlockstackWallet(seedBuffer)
      const addressIndex = 0
      const expectedSalt = 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
      const actualSalt = wallet.getIdentitySalt()
      assert.equal(actualSalt, expectedSalt)

      const expectedAddress =  '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk'
      const identityKeyPair = wallet.getIdentityKeyPair(addressIndex)
      const actualAddress = identityKeyPair.address
      assert.equal(actualAddress, expectedAddress)

      const origin = 'https://amazing.app:443'

      const expectedAppNodeAddress = '1A9NEhnXq5jDp9BRT4DrwadRP5jbBK896X'
      const appNodeSK = BlockstackWallet.getAppPrivateKey(identityKeyPair.appsNodeKey,
                                                          wallet.getIdentitySalt(),
                                                          origin)

      const actualAppNodeAddress = hexStringToECPair(`${appNodeSK}01`).getAddress()
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

  describe('decryptKeychain', () => {
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
      decryptKeychain('password123', encryptedBackupPhrase).then((keychain) => {
        assert.equal(masterKeychain.getIdentifier().toString('hex'),
                     keychain.rootNode.getIdentifier().toString('hex'))
        done()
      })
    })

    it('should return an error object if something goes wrong', (done) => {
      decryptKeychain('badpass', encryptedBackupPhrase).catch((err) => {
        assert.isTrue(err instanceof Error)
        assert.equal(err.message, 'Incorrect password')
        done()
      })
    })
  })
})
