import bip39 from 'bip39'
import { BlockstackWallet, publicKeyToAddress, getPublicKeyFromPrivate } from 'blockstack'
import {
  getIdentityPrivateKeychain,
  getIdentityOwnerAddressNode,
  findAddressIndex,
  decryptMasterKeychain,
  getCorrectAppPrivateKey
 } from '../../app/js/utils'

let masterKeychain = null
const backupPhrase = 'sound idle panel often situate develop unit text design antenna vendor screen opinion balcony share trigger accuse scatter visa uniform brass update opinion media'

describe('account-utils', () => {
  beforeEach(() => {
    const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
    masterKeychain = BlockstackWallet.fromSeedBuffer(seedBuffer)
      .toBase58()
  })

  afterEach(() => {
    masterKeychain = null
  })

  describe('test app private keys', () => {
    it('should correctly generate a legacy app private key', () => {
      const appsNodeKey = 'xprvA1bXJqMaKqHFnYB3LyLmtJMXgpCKisknF2EuVBrNs6UkvR3U4W2vtdEK9' +
            'ESFx82YoX6Xi491prYxxbhFDhEjyRTsjdjFkhPPhRQQQbz92Qh'
      const salt = 'e61f9eb10842fc3e237fba6319947de93fb630df963342914339b96790563a5a'

      const legacyAppSK = 'b21aaf76b684cc1b6bf8c48bcec5df1adb68a7a6970e66c86fc0e86e09b4d244'
      const newAppSK    = '3168aefff6aa53959a002112821384c41f39f538c0e8727a798bb40beb62ca5e'

      const expectLegacy1 = getCorrectAppPrivateKey(
        { publishData: true },
        { apps: { 'https://blockstack-todos.appartisan.com':
                  'https://gaia.blockstack.org/hub/18Dg8z4zH13HTpMSERjc3iZTQsyzF3373R/' } },
        appsNodeKey,
        salt,
        'https://blockstack-todos.appartisan.com')
      const expectLegacy2 = getCorrectAppPrivateKey(
        { publishData: false },
        {},
        appsNodeKey,
        salt,
        'https://blockstack-todos.appartisan.com')
      const expectLegacy3 = getCorrectAppPrivateKey(
        { publishData: true },
        { apps: { 'https://blockstack-todos.appartisan.com':
                  'https://gaia.blockstack.org/hub/18Dg8z4zH13HTpMSERjc3iZTQsyzF3373R' } },
        appsNodeKey,
        salt,
        'https://blockstack-todos.appartisan.com')
      const expectNew1 = getCorrectAppPrivateKey(
        { publishData: false },
        {},
        appsNodeKey,
        'potato potato',
        'carrot carrot carrot')
      const expectNew2 = getCorrectAppPrivateKey(
        { publishData: true },
        {}, appsNodeKey, 'potato potato', 'carrot carrot carrot')
      const expectNew3 = getCorrectAppPrivateKey(
        { publishData: true },
        { apps: { 'carrot carrot carrot': 'abc.co/abcd.c/'} },
        appsNodeKey, 'potato potato', 'carrot carrot carrot')

      assert.equal(expectLegacy1, legacyAppSK)
      assert.equal(expectLegacy2, legacyAppSK)
      assert.equal(expectLegacy3, legacyAppSK)
      assert.equal(expectNew1, newAppSK)
      assert.equal(expectNew2, newAppSK)
      assert.equal(expectNew3, newAppSK)
    })
  })

  describe('getIdentityOwnerAddressNode', () => {
    it('should generate app key tree', () => {
      const wallet = BlockstackWallet.fromBase58(masterKeychain)
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
      const appNodeKey = BlockstackWallet.getLegacyAppPrivateKey(
        appsNodeKey, identityKeyPair.salt, origin)

      const expectedAppNodeAddress = '1A9NEhnXq5jDp9BRT4DrwadRP5jbBK896X'
      const actualAppNodeAddress = publicKeyToAddress(getPublicKeyFromPrivate(appNodeKey))
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
      BlockstackWallet.encryptMnemonic(backupPhrase, password).then(hex => {
        encryptedBackupPhrase = hex
        const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
        masterKeychain = BlockstackWallet.fromSeedBuffer(seedBuffer)
          .toBase58()
        done()
      }).catch((err) => {
        console.log(err)
        assert.false()
        done()
      })
    })

    afterEach(() => {
      encryptedBackupPhrase = null
    })

    it('should return the decrypted master keychain', (done) => {
      decryptMasterKeychain('password123', encryptedBackupPhrase).then((actualMnemonic) => {
        const seedBuffer = bip39.mnemonicToSeed(backupPhrase)
        const keychain = BlockstackWallet.fromSeedBuffer(seedBuffer).toBase58()
        assert.equal(masterKeychain, keychain)
        done()
      }).catch((err) => {
        console.log(err)
        assert.false()
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
