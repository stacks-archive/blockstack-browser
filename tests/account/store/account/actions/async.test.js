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
        console.log(actions)
        assert.equal(actions.length, 1)
        assert.equal(actions[0].type, 'CREATE_ACCOUNT')
      })
    })

    it('restores an existing wallet and keychain', () => {
      const store = mockStore({})
      const password = 'password'
      const backupPhrase = 'sound idle panel often situate develop unit text design antenna vendor screen opinion balcony share trigger accuse scatter visa uniform brass update opinion media'

      const bitcoinPublicKeychain = '03789baa7041b0c0ec8c42e1a46b9da04f6f2b0906df65901edf8b80c7db962656'
      const identityPublicKeychain = '03dddec01c1334ee131921f8f2d2bcad2218467f32e720563d5771916aff3612e3'
      const firstBitcoinAddress = '112FogMTesWmLzkWbtKrSg3p9LK6Lucn4s'
      const firstIdentityAddress = '14Sx3aur1gkZg3mptVLfVYWr1pjHbvBTLe'
      const firstIdentityKey = 'c42fe514dc4744c6ae4ecd7e4f9c2d939a9f4b976501228a055a8284906d85c6'
      const firstIdentityKeyID = '032421e0d2728a569f4871b7e62d4b57e0feddbdbcccbdf0a73012556f48b4f936'


      return store.dispatch(AccountActions.initializeWallet(password, backupPhrase))
      .then(() => {
        const actions = store.getActions()
        assert.equal(actions.length, 1)
        assert.equal(actions[0].bitcoinPublicKeychain, bitcoinPublicKeychain)
        assert.equal(actions[0].identityPublicKeychain, identityPublicKeychain)
        assert.equal(actions[0].firstBitcoinAddress, firstBitcoinAddress)
        assert.equal(actions[0].firstIdentityAddress, firstIdentityAddress)
        assert.equal(actions[0].firstIdentityKey, firstIdentityKey)
        assert.equal(actions[0].firstIdentityKeyID, firstIdentityKeyID)
      })
    })

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
    }).timeout(5000) // encryption & decryption is slow
  })
})
