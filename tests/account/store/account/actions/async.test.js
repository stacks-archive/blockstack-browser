import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { AccountActions } from '../../../../../app/js/account/store/account'
import { decrypt } from '../../../../../app/js/utils/encryption-utils'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


describe('Account Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('initializeWallet', () => {
    it('creates an new account with a new master keychain', () => {
      const store = mockStore({})

      const password = 'password'

      return store.dispatch(AccountActions.initializeWallet(password))
      .then(() => {
        const actions = store.getActions()
        assert.equal(actions.length, 1)
        assert.equal(actions[0].type, 'CREATE_ACCOUNT')
      })
    }).timeout(5000)

    it('restores an existing wallet and keychain', () => {
      const store = mockStore({})
      const password = 'password'
      const backupPhrase = 'sound idle panel often situate develop unit text design antenna vendor screen opinion balcony share trigger accuse scatter visa uniform brass update opinion media'

      const bitcoinPublicKeychain = 'xpub6Br2scNTh9Luk2VPebfEvjbWWC5WhvxpxgK8ap2qhYTS4xvZu8Y3G1npmx8DdvwUdCbtNb7qNLyTChKMbY8dThLV5Zvdq9AojQjxrM6gTC8'
      const identityPublicKeychain = 'xpub6B6tCCb8T5eXUKVYUoppmSi5KhNRboRJUwqHavxdvQTncfmBNFCX4Nq9w8DsfuS6AYPpBYRuS3dcUuyF8mQtwEydAEN3A4Cx6HDy58jpKEb'
      const firstBitcoinAddress = '112FogMTesWmLzkWbtKrSg3p9LK6Lucn4s'

      const identityAddresses = ['1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk']

      const identityKeypairs =
      [{ key: 'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
        keyID: '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
        address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
        appsNodeKey: 'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarxXMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
        salt: 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e' }]

      return store.dispatch(AccountActions.initializeWallet(password, backupPhrase))
      .then(() => {
        const actions = store.getActions()
        assert.equal(actions.length, 1)
        assert.equal(actions[0].bitcoinPublicKeychain, bitcoinPublicKeychain)
        assert.equal(actions[0].identityPublicKeychain, identityPublicKeychain)
        assert.equal(actions[0].firstBitcoinAddress, firstBitcoinAddress)
        assert.deepEqual(actions[0].identityAddresses, identityAddresses)
        assert.deepEqual(actions[0].identityKeypairs, identityKeypairs)
      })
    }).timeout(5000)

    it('generates and restores the same wallet', () => {
      const store1 = mockStore({})

      const password = 'password'

      return store1.dispatch(AccountActions.initializeWallet(password))
      .then(() => {
        const actions1 = store1.getActions()
        assert.equal(actions1.length, 1)
        assert.equal(actions1[0].type, 'CREATE_ACCOUNT')

        const encryptedBackupPhrase = actions1[0].encryptedBackupPhrase
        const identityPublicKeychain = actions1[0].identityPublicKeychain
        const bitcoinPublicKeychain = actions1[0].bitcoinPublicKeychain



        return decrypt(new Buffer(encryptedBackupPhrase, 'hex'), password)
        .then((plaintextBuffer) => {
          const backupPhrase = plaintextBuffer.toString()
          const store2 = mockStore({})
          return store2.dispatch(AccountActions.initializeWallet(password, backupPhrase))
          .then(() => {
            const actions2 = store2.getActions()
            assert.equal(actions2.length, 1)
            assert.equal(actions2[0].type, 'CREATE_ACCOUNT')
            assert.equal(actions2[0].identityPublicKeychain, identityPublicKeychain)
            assert.equal(actions2[0].bitcoinPublicKeychain, bitcoinPublicKeychain)
          })
        })
      })
    }).timeout(7000) // encryption & decryption is slow
  })
})
