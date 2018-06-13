import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { RegistrationActions } from '../../../../../app/js/profiles/store/registration'
import DEFAULT_API from '../../../../../app/js/account/store/settings/default'
import { ECPair } from 'bitcoinjs-lib'
import { BitcoinKeyPairs } from '../../../../fixtures/bitcoin'
import sinon from 'sinon'
import { REGISTRATION_BEFORE_SUBMIT } from '../../../../../app/js/profiles/store/registration/types'
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Registration Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('beforeRegister', () => {
    it('should return an action of type REGISTRATION_BEFORE_SUBMIT', () => {
      const expectedActions = [
        {
          type: REGISTRATION_BEFORE_SUBMIT
        }
      ]

      const store = mockStore({})
      store.dispatch(RegistrationActions.beforeRegister())
      assert.deepEqual(store.getActions(), expectedActions)
    })
  })

  describe('registerDomain', () => {
    it('generates and sends transactions for name registration', done => {
      const domainName = 'satoshi.id'
      const ownerAddress = '1GnrEexgXvHCZobXDVdhpto6QPXKthN99n'
      const coercedAddress = 'nGnrEexgXvHCZobXDVdhpto6QPXKthN99n'
      const identityIndex = 0
      const paymentKey =
        '91a4c8ad3cb0ef0f5f24f9d7a3364c3a6b39296b072cea448a1b53d5d70499a5'
      const compressedKey = `${paymentKey}01`
      const zoneFile =
        '$ORIGIN satoshi.id\n$TTL 3600\n_http._tcp\tIN\tURI\t10\t1\t"https://gaia.blockstack.org/hub/1GnrEexgXvHCZobXDVdhpto6QPXKthN99n/0/profile.json"\n\n'

      const network = {
        modifyUTXOSetFrom: sinon.stub().returns(),
        broadcastNameRegistration: sinon.stub().resolves({ status: true }),
        coerceAddress: sinon.stub().returns(coercedAddress)
      }

      const preorderTxHash = 'rawpreordertxhash'
      const registerTxHash = 'rawregistertxhash'

      const transactions = {
        makePreorder: sinon.stub().resolves(preorderTxHash),
        makeRegister: sinon.stub().resolves(registerTxHash)
      }

      RegistrationActions.registerDomain(
        network,
        transactions,
        domainName,
        identityIndex,
        ownerAddress,
        paymentKey,
        zoneFile
      ).then(response => {
        assert(response.status)
        sinon.assert.calledWith(network.coerceAddress, ownerAddress)
        sinon.assert.calledWith(
          transactions.makePreorder,
          domainName,
          coercedAddress,
          compressedKey
        )
        sinon.assert.calledWith(network.modifyUTXOSetFrom, preorderTxHash)
        sinon.assert.calledWith(
          transactions.makeRegister,
          domainName,
          coercedAddress,
          compressedKey,
          zoneFile
        )
        sinon.assert.calledWith(
          network.broadcastNameRegistration,
          preorderTxHash,
          registerTxHash,
          zoneFile
        )
      }).then(done).catch(done)
    })
  })

  describe('registerSubdomain', () => {
    it('sends request for subdomain registration', () => {
      const domainName = 'satoshi.personal.id'
      const ownerAddress = '1GnrEexgXvHCZobXDVdhpto6QPXKthN99n'
      const identityIndex = 0
      const zoneFile =
        '$ORIGIN satoshi.id\n$TTL 3600\n_http._tcp\tIN\tURI\t10\t1\t"https://gaia.blockstack.org/hub/1GnrEexgXvHCZobXDVdhpto6QPXKthN99n/0/profile.json"\n\n'

      const mockAPI = Object.assign({}, DEFAULT_API, {
        subdomains: {
          'personal.id': {
            registerUrl: 'http://localhost:1234/register'
          }
        }
      })

      const mockResponseBody = {
        status: true,
        message:
          'Your subdomain registration was received, and will be included in the blockchain soon.'
      }
      nock('http://localhost:1234')
        .post(`/register`)
        .reply(200, mockResponseBody)

      return RegistrationActions.registerSubdomain(
        mockAPI,
        domainName,
        identityIndex,
        ownerAddress,
        zoneFile
      ).then(response => {
        assert.deepEqual(response, mockResponseBody)
      })
    })
  })
})
