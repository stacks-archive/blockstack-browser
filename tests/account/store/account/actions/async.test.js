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

      const identityAddresses = [ '1BkD8arxDnyXJc2rRu9hu9UWvskuMAJTPC',
       '1FmBsrEAwHMtznYYeBRfiPxqJ9Nqz9rBkq',
       '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC',
       '14gbWk2rvj1jvdrEXKBfFrwg6qxCHDQEsE',
       '1KdRFvPKQ8vEVAtD4rw2meAp5G8AYyfnWC',
       '1HjKNbLWvQfSdhpDAQw7RGPE5CUY5gLNHH',
       '1N7Bu3evb7GWRg8yRXZN8A9dj9mny6zxm8',
       '1PFQ6F4Ntug1o29jU2XJTWfH3wsxNug9Y2',
       '1Mko7SGvKjNfZLYLphcMUPDP9kph3gfuJe',
       '1QK463ayWwrYwXNGN45oH3owfTkkiXp96w',
       '1FtSPdTameYY1NkNPQqSc1TFea4KA4iZsz',
       '17TY2WZAww7JwoQS5BTQ9ubSaT2iWXpya',
       '1E9R7Ji1CpyU2NCfM9rEiXS2FLYkq2mH1t',
       '1MHFWK9MinFdzHFJxhVrytiBdpxKgimxJk',
       '135hncEebn9R6c5uN5ksZeNdb7xB9jsD4p' ]

       const identityKeypairs = [ { key: '6f7de55a5248da935d127568f7ddb76ddd36617677184d534c51950be78a908a',
    keyID: '0378a24a992d123c035303978ee395b2f50714fb1c97837cfb2cc7b6ee8fae6a87',
    address: '1BkD8arxDnyXJc2rRu9hu9UWvskuMAJTPC' },
  { key: '4e20f3d5fa151cab4696e83cadf55903bffdd6fe24a6c2d4549d09dbbcf6c5bf',
    keyID: '03f4ba5c0a25804372b365c979404dbc8a1508af97cb3ecebed0201637f1bba23b',
    address: '1FmBsrEAwHMtznYYeBRfiPxqJ9Nqz9rBkq' },
  { key: '93985389f04ba40c8710663ce1f91ff82826d9238fac1b61d4ad2ad59155721e',
    keyID: '03029755ac6f68872abef6efbccf54226b2cf9c12500b2ff4852280c1093a389ec',
    address: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC' },
  { key: '423f508d77a66097f160c9b718b30bad5090dc3f997da363bdc6725b8873ce57',
    keyID: '0353a00bcff3170226d7136f38c71de3fcd00f08b9740f82e10c5e02517aa9f5e5',
    address: '14gbWk2rvj1jvdrEXKBfFrwg6qxCHDQEsE' },
  { key: '6b1fa6e4f4a4a0581dedc0985b9f3b20d35451cf50ff90172ea625cfbffb1a6c',
    keyID: '0228c07ff1e682c0380a3ce8c7ddc5cee4a427229911cc97bf71e9562e7df9dac1',
    address: '1KdRFvPKQ8vEVAtD4rw2meAp5G8AYyfnWC' },
  { key: '518e7362976ecea4d8a04c1882337f602413e587e685418e468df2d0bd07d842',
    keyID: '03a292f15dafbdab3618e4a6dd0569779d706a8b1feab19ff7b2c1c31a56f9914a',
    address: '1HjKNbLWvQfSdhpDAQw7RGPE5CUY5gLNHH' },
  { key: 'fd7750fd42429d4471b734dcde0e7fb68ac59bee5a917873f14d91a795225ef5',
    keyID: '02c4143fef1d713367bbcb85069775fddb12b5df2bcc39f78f84f4dce00ca9449b',
    address: '1N7Bu3evb7GWRg8yRXZN8A9dj9mny6zxm8' },
  { key: '00862c11ee0a3b0df3783317e5f2f986b6e2a91b9300ec4eaaf6505b5a568ffa',
    keyID: '025c840e91f43733eb4537be45b221c3a97eca44d6e717e67ec7c01aec7e5a5af0',
    address: '1PFQ6F4Ntug1o29jU2XJTWfH3wsxNug9Y2' },
  { key: '06e35a1694eb29d6691f7446dd74ce3f638ccbf066fbceb785c24233f6db9018',
    keyID: '03fbe8d407f87109fe28ffd92c80f725989642c155f11b84dee1911c77591f4a3b',
    address: '1Mko7SGvKjNfZLYLphcMUPDP9kph3gfuJe' },
  { key: 'eb08a55646b1a695c2a03239a9ff89e3b05f0f7c00ab11e36252b0780d3a7436',
    keyID: '03e7da002cc9a04f9c175678b153bd81fb72fc0693441b09011b321cae54cf3cf8',
    address: '1QK463ayWwrYwXNGN45oH3owfTkkiXp96w' },
  { key: 'cf20360c1f9093a7457a8345ded725fef7bd1186a2765760ee5fdebde4dd8f17',
    keyID: '022a9d5d309228824ba097b63cfdeae8c21b70699337c5c846f6316ced854d7611',
    address: '1FtSPdTameYY1NkNPQqSc1TFea4KA4iZsz' },
  { key: 'e441b29ffce8782703ec15665e2cd503f1c0ca4b796d557435389119b4de3438',
    keyID: '02dd64fb2c78e12b778802f68ca81dbe5a4e2096c56433a6c8d4e5d6cd26ae21ed',
    address: '17TY2WZAww7JwoQS5BTQ9ubSaT2iWXpya' },
  { key: '2e0bca1297a80301db502e65dadd99a5deff9b68c673a563c520de15a726d727',
    keyID: '03015a280ac8dd5aed1a7d188cc640754c1424e0dbf93ec8b17b714a5f12b34721',
    address: '1E9R7Ji1CpyU2NCfM9rEiXS2FLYkq2mH1t' },
  { key: '9d18b2e8bf9d7243973a26417e585c9e57d295afe241f413031a52d64506c183',
    keyID: '02d0959c25ecfc891cf8b0bb83f5981b0c352c665f749fe4f0b8f1cd0ae46fbb81',
    address: '1MHFWK9MinFdzHFJxhVrytiBdpxKgimxJk' },
  { key: '0f63d6d9e128893a361c63fee6c847429cf593340c4714853cc58a4b36dd9dfe',
    keyID: '022a09fbcf580c44e1d087824f4eed72443c640ecfdaa7841fda536fb3209aa7aa',
    address: '135hncEebn9R6c5uN5ksZeNdb7xB9jsD4p' } ]

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
