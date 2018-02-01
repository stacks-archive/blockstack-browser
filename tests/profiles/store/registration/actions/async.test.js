import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { RegistrationActions } from '../../../../../app/js/profiles/store/registration'
import DEFAULT_API from '../../../../../app/js/account/store/settings/default'
import { ECPair } from 'bitcoinjs-lib'
import { BitcoinKeyPairs } from '../../../../fixtures/bitcoin'


const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)


describe('Registration Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('beforeRegister', () => {
    it('should return an action of type REGISTRATION_BEFORE_SUBMIT', () => {
      const expectedActions = [{
        type: 'REGISTRATION_BEFORE_SUBMIT'
      }]

      const store = mockStore({
      })
      store.dispatch(RegistrationActions.beforeRegister())
      assert.deepEqual(store.getActions(), expectedActions)
    })
  })

  describe('registerName', () => {
    const ecPair = ECPair.fromWIF(BitcoinKeyPairs.test1.wif)
    const address = ecPair.getAddress()
    const key = ecPair.d.toBuffer(32).toString('hex')
    const keyID = ecPair.getPublicKeyBuffer().toString('hex')
    const keypair = {
      address,
      key,
      keyID
    }

    const paymentUncompressedPrivateKey = '91a4c8ad3cb0ef0f5f24f9d7a3364c3a6b39296b072cea448a1b53d5d70499a5'

    const setOwnerKeyBody = JSON.stringify('76d53e1f52578b41e865ec327d6f51cd6e78633d8a1b674beb30f53d1a1e389501')

    it('successfully registers a name with gaia hub', () => {

      const registrationBody = { name: 'satoshi.id',
        owner_address: ecPair.getAddress(),
        zonefile: '$ORIGIN satoshi.id\n$TTL 3600\n_http._tcp\tIN\tURI\t10\t1\t"https://gaia.blockstack.org/hub/1GnrEexgXvHCZobXDVdhpto6QPXKthN99n/0/profile.json"\n\n',
        min_confs: 0,
        unsafe: true,
        payment_key: `${paymentUncompressedPrivateKey}01`}

      const mockHubInfoResponse = { "challenge_text":
                                    "[\"gaiahub\",\"2018\",\"storage.blockstack.org\",\"blockstack_storage_please_sign\"]",
                                    "read_url_prefix":
                                    "https://gaia.blockstack.org/hub/" }
      nock('https://hub.blockstack.org')
      .get('/hub_info')
      .reply(200, mockHubInfoResponse)

      const mockResponseBody = {"publicURL":`https://gaia.blockstack.org/hub/1GnrEexgXvHCZobXDVdhpto6QPXKthN99n/0/profile.json`}
      // mock gaia hub
      nock('https://hub.blockstack.org')
      .post(`/store/${BitcoinKeyPairs.test1.address}/profile.json`)
      .reply(200, mockResponseBody)

      const mockGaiaConfig = {
        gaiaHubConfig: {
          address: '1GnrEexgXvHCZobXDVdhpto6QPXKthN99n',
          server: 'https://hub.blockstack.org',
          token: 'eyJwdWJsaWNrZXkiOiIwMjkyYzkwZGU5ZGE1MWY0M2M2NWJhZGVlYmZmYmRkN2Y2ZjUxNGEyM2M1OGEzNzAxNTlmM2RkNzQwYzNjOTI0YmQiLCJzaWduYXR1cmUiOiIzMDQ0MDIyMDU1OWQ5YjRmYWFmOWRjZDM4MGZhYzJjMjgyZGIyNThmN2YzZWY2OWRiNzFmMTIwNmRjZjU0MGEwYzNhMzIzZDEwMjIwNDQ4N2JhYjNhNzBkODYxNmZmZjI3YjM1YmRhNzE5NmFmMDc0ZDY3M2Q4OWI0MmY1ZTAwNzBmYWNlMGRlMzFlMCJ9',
          url_prefix: 'https://gaia.blockstack.org/hub/'
        }
      }

      // mock core
      nock('http://localhost:6270')
      .put('/v1/wallet/keys/owner', setOwnerKeyBody)
      .reply(201, {}, { 'Content-Type': 'application/json' })


      nock('http://localhost:6270')
      .post('/v1/names', registrationBody)
      .reply(201, {}, { 'Content-Type': 'application/json' })

      const store = mockStore({
        lastNameEntered: 'satoshi.id',
        names: {}
      })

      const mockAPI = Object.assign({}, DEFAULT_API, {
        hostedDataLocation: 'gaia-hub',
        gaiaHubConfig: mockGaiaConfig.gaiaHubConfig,
        gaiaHubUrl: 'https://hub.blockstack.org'
      })

      return store.dispatch(RegistrationActions.registerName(mockAPI,
        'satoshi.id', {}, 0, BitcoinKeyPairs.test1.address, keypair, paymentUncompressedPrivateKey))
      .then(() => {
        const expectedActions = [
          { type: 'PROFILE_UPLOADING' },
          { type: 'REGISTRATION_SUBMITTING' },
          { type: 'REGISTRATION_SUBMITTED' },
          { type: 'ADD_USERNAME',
            index: 0,
            username: 'satoshi.id'
          }
        ]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })

    // it('warns of missing payment key for non-subdomain names when using dropbox', () => {
    //
    //   // mock dropbox
    //
    //   nock('https://api.dropboxapi.com')
    //   .options('/2/files/delete')
    //   .reply(200)
    //   .post('/2/files/delete', { path: '/satoshi.id/profile.json' })
    //   .reply(200)
    //
    //   nock('https://content.dropboxapi.com').options('/2/files/upload')
    //   .reply(200)
    //   .post('/2/files/upload')
    //   .reply(200, {
    //     name: 'profile.json',
    //     path_lower: '/satoshi.id/profile.json',
    //     path_display: '/satoshi.id/profile.json',
    //     id: 'id:tFN0g-hnfJAAAAAAAAAAdA',
    //     client_modified: '2017-04-22T12:53:25Z',
    //     server_modified: '2017-04-22T12:53:26Z',
    //     rev: 'c0524a1d34',
    //     size: 1353,
    //     content_hash: 'a9b121c41aa35d580e22798b4863c973a34dce2b8b6498304913f9bf1733045c'
    //   })
    //
    //   nock('https://api.dropboxapi.com')
    //   .options('/2/sharing/create_shared_link_with_settings')
    //   .reply(200)
    //   .post('/2/sharing/create_shared_link_with_settings')
    //   .reply(200, { url: 'https://www.dropbox.com/s/eft9mgspq5ff3qe/profile.json?dl=0' })
    //
    //
    //   const store = mockStore({
    //     lastNameEntered: 'satoshi.id',
    //     names: {}
    //   })
    //
    //   const mockAPI = Object.assign({}, DEFAULT_API, {
    //     hostedDataLocation: 'dropbox',
    //     dropboxAccessToken: '1Uvs2jihzY0bABCDEFGHsFeHi27xznbJ_VD2HlfrYUduaEpSTrM-iX3Bm8mahYrV'
    //   })
    //
    //   return store.dispatch(RegistrationActions.registerName(mockAPI,
    //     'satoshi.id', 0, BitcoinKeyPairs.test1.address, keypair))
    //   .then(() => {
    //     assert(0, 'This promise is supposed to be rejected.')
    //   })
    //   .catch(() => {
    //     const expectedActions = [
    //       { type: 'PROFILE_UPLOADING' },
    //       { "error": "Missing payment key",
    //         "type": "PROFILE_UPLOAD_ERROR" }
    //     ]
    //     assert.deepEqual(store.getActions(), expectedActions)
    //   })
    // })

    it('warns of missing payment key for non-subdomain names when using gaia hub', () => {


      const mockResponseBody = {"publicURL":`https://gaia.blockstack.org/hub/${BitcoinKeyPairs.test1.address}/0/profile.json`}
      // mock gaia hub
      nock('https://hub.blockstack.org')
      .post(`/store/${BitcoinKeyPairs.test1.address}/profile.json`)
      .reply(200, mockResponseBody)


      const mockHubInfoResponse = { "challenge_text":
                                    "[\"gaiahub\",\"2018\",\"storage.blockstack.org\",\"blockstack_storage_please_sign\"]",
                                    "read_url_prefix":
                                    "https://gaia.blockstack.org/hub/" }
      nock('https://hub.blockstack.org')
      .get('/hub_info')
      .reply(200, mockHubInfoResponse)

      const store = mockStore({
        lastNameEntered: 'satoshi.id',
        names: {}
      })

      const mockGaiaConfig = {
        gaiaHubConfig: {
          address: `${BitcoinKeyPairs.test1.address}`,
          server: 'https://hub.blockstack.org',
          token: 'eyJwdWJsaWNrZXkiOiIwMjkyYzkwZGU5ZGE1MWY0M2M2NWJhZGVlYmZmYmRkN2Y2ZjUxNGEyM2M1OGEzNzAxNTlmM2RkNzQwYzNjOTI0YmQiLCJzaWduYXR1cmUiOiIzMDQ0MDIyMDU1OWQ5YjRmYWFmOWRjZDM4MGZhYzJjMjgyZGIyNThmN2YzZWY2OWRiNzFmMTIwNmRjZjU0MGEwYzNhMzIzZDEwMjIwNDQ4N2JhYjNhNzBkODYxNmZmZjI3YjM1YmRhNzE5NmFmMDc0ZDY3M2Q4OWI0MmY1ZTAwNzBmYWNlMGRlMzFlMCJ9',
          url_prefix: 'https://gaia.blockstack.org/hub/'
        }
      }

      const mockAPI = Object.assign({}, DEFAULT_API, {
        hostedDataLocation: 'gaia-hub',
        gaiaHubConfig: mockGaiaConfig.gaiaHubConfig,
        gaiaHubUrl: 'https://hub.blockstack.org'
      })

      return store.dispatch(RegistrationActions.registerName(mockAPI,
        'satoshi.id', {}, 0, BitcoinKeyPairs.test1.address, keypair))
      .then(() => {
        assert(0, 'This promise is supposed to be rejected.')
      })
      .catch(() => {
        const expectedActions = [
          { type: 'PROFILE_UPLOADING' },
          { "error": "Missing payment key",
            "type": "PROFILE_UPLOAD_ERROR" }
        ]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })
})
