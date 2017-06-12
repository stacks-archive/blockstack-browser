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

      const identityAddresses = ['1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
        '14jdV3dEQ7TmEaZePaLmKgMDg9Y48UFTL3',
        '173z9nKqGr3Fs9J29HpEYU1TvNKQ2CDFK',
        '1PQjUXFMwoaLsrf9UKQ7L3f48zRdtVoZkb',
        '19Ju53ve2WKLnhz4jJWyeYsdgr3pQJY3Uk',
        '16E8iP51bRdLBRLsxSRJsfUYkqLeddqeL4',
        '1MxkFdy3Vt9bL3VSEF6M9CejUmJacrVXja',
        '1CSV6PR1gXrip8xYiYsjTYjQMfXu6hfBKr',
        '1Ke5xt7xR9kApU3Am2WKPnqHqN9aaGRXqe']

      const identityKeypairs =
      [{ key: 'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
        keyID: '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
        address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk' },
      { key: 'a953253c76e5bbd771683c0bb33dab12b2b1ee20faf710e95fba872bc29453e4',
        keyID: '03f5a11808101b006ff9a0202722442cd1dc6acdf5080283c67f4afd209c4931ac',
        address: '14jdV3dEQ7TmEaZePaLmKgMDg9Y48UFTL3' },
      { key: '2f06aeabde23fbf60e147c3aa54bfbdb8e1172f411e25b8f3d935fa6fed631e6',
        keyID: '02f768041024b4fea7738f6bc18ec19967ce97e79bd97253e9687cecf9ccd57b2c',
        address: '173z9nKqGr3Fs9J29HpEYU1TvNKQ2CDFK' },
      { key: '6960d937c49ea55d1762921c04bf481f6628184642803de2b6f443957915ce7e',
        keyID: '039864e61f47e6f7b8d3f0817f33796cb906bade56c3273df3b5d00674895a92a0',
        address: '1PQjUXFMwoaLsrf9UKQ7L3f48zRdtVoZkb' },
      { key: '9a4ae43fc4403cfea71d0ee8242ec43f82243ee492eb36cfefbe9f49f5ab3ba7',
        keyID: '02ab597f0ab1123e49d8b9e121e9eb3052b6cca8e18d06b68c40f02b896efb10de',
        address: '19Ju53ve2WKLnhz4jJWyeYsdgr3pQJY3Uk' },
      { key: '2d8178efd69795bc0b4be9125055c8f1a45cb3dfda71490c94581e5f05df1be5',
        keyID: '024debed6ee1c0f5eccba7412bf1e5b9de0b995d2314307afc17909f5a8dc19d2c',
        address: '16E8iP51bRdLBRLsxSRJsfUYkqLeddqeL4' },
      { key: '17999ace3eda3c5a63480bcd315df1299c37389a77f86ba3958f24be3021e4fc',
        keyID: '0295055467f5de26f18f94e04b6df5bfe0ffc9c900171c52c298bc5501706a9d6c',
        address: '1MxkFdy3Vt9bL3VSEF6M9CejUmJacrVXja' },
      { key: '4e9bd3da393baaaf5390ddb8def15775d7200d8f139f328711ea1077ffdee9a4',
        keyID: '02c08b760acb2cf2af118c27179febb0a493c85a9f0f7c89c48be685d111a79afc',
        address: '1CSV6PR1gXrip8xYiYsjTYjQMfXu6hfBKr' },
      { key: '938a2b25029a7141cfad0db233ee600404c847c155ae4aef4ded189832e98cc3',
        keyID: '0274b4b108c95a0fff835495b70c0847a85018eef5680602dde5dae2ec867a6660',
        address: '1Ke5xt7xR9kApU3Am2WKPnqHqN9aaGRXqe' }]

      return store.dispatch(AccountActions.initializeWallet(password, backupPhrase))
      .then(() => {
        const actions = store.getActions()
        console.log(actions[0].identityKeypairs)
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
