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
    const registrationBody = { name: 'satoshi.id',
      owner_address: ecPair.getAddress(),
      zonefile: '$ORIGIN satoshi.id\n$TTL 3600\n_http._tcp\tIN\tURI\t10\t1\t"www.dropbox.com/s/eft9mgspq5ff3qe/profile.json?dl=1"\n\n',
      min_confs: 0 }

    it('successfully registers a name', () => {

      // mock dropbox

      nock('https://api.dropboxapi.com')
      .options('/2/files/delete')
      .reply(200)
      .post('/2/files/delete', { path: '/satoshi.id/profile.json' })
      .reply(200)

      nock('https://content.dropboxapi.com').options('/2/files/upload')
      .reply(200)
      .post('/2/files/upload')
      .reply(200, {
        name: 'profile.json',
        path_lower: '/satoshi.id/profile.json',
        path_display: '/satoshi.id/profile.json',
        id: 'id:tFN0g-hnfJAAAAAAAAAAdA',
        client_modified: '2017-04-22T12:53:25Z',
        server_modified: '2017-04-22T12:53:26Z',
        rev: 'c0524a1d34',
        size: 1353,
        content_hash: 'a9b121c41aa35d580e22798b4863c973a34dce2b8b6498304913f9bf1733045c'
      })

      nock('https://api.dropboxapi.com')
      .options('/2/sharing/create_shared_link_with_settings')
      .reply(200)
      .post('/2/sharing/create_shared_link_with_settings')
      .reply(200, { url: 'https://www.dropbox.com/s/eft9mgspq5ff3qe/profile.json?dl=0' })

      // mock core
      nock('http://localhost:6270')
      .post('/v1/names', registrationBody)
      .reply(201, {}, { 'Content-Type': 'application/json' })

      const store = mockStore({
        lastNameEntered: 'satoshi.id',
        names: {}
      })

      const mockAPI = Object.assign({}, DEFAULT_API, {
        hostedDataLocation: 'dropbox',
        dropboxAccessToken: '1Uvs2jihzY0bABCDEFGHsFeHi27xznbJ_VD2HlfrYUduaEpSTrM-iX3Bm8mahYrV'
      })

      return store.dispatch(RegistrationActions.registerName(mockAPI,
        'satoshi.id', BitcoinKeyPairs.test1.address, keypair))
      .then(() => {
        const expectedActions = [
          { type: 'PROFILE_UPLOADING' },
          { type: 'REGISTRATION_SUBMITTING' },
          { type: 'REGISTRATION_SUBMITTED' }
        ]
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })
})
