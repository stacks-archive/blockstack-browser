import { uploadProfile } from '../../app/js/account/utils'
import { ECPair } from 'bitcoinjs-lib'
import { BitcoinKeyPairs } from '../fixtures/bitcoin'
import nock from 'nock'

const mockHubInfoResponse = {
  challenge_text: '["gaiahub","2018","storage.blockstack.org","blockstack_storage_please_sign"]',
  read_url_prefix: 'https://gaia.blockstack.org/hub/'
}

const globalAPIConfig = {
  gaiaHubConfig: {
    address: '15GAGiT2j2F1EzZrvjk3B8vBCfwVEzQaZx',
    server: 'https://hub.blockstack.org',
    token: 'dummy-token',
    url_prefix: 'https://gaia.blockstack.org/hub/'
  },
  gaiaHubUrl: 'https://hub.blockstack.org'
}

describe('upload-profile', () => {
  beforeEach(() => {
    nock('https://hub.blockstack.org')
      .get('/hub_info')
      .reply(200, mockHubInfoResponse)
  })

  afterEach(() => {})

  describe('uploadProfile', () => {
    it('should upload to the zonefile entry, using the global uploader if necessary', () => {
      const ecPair = ECPair.fromWIF(BitcoinKeyPairs.test1.wif)
      const address = ecPair.getAddress()
      const key = ecPair.d.toBuffer(32).toString('hex')
      const keyPair = {
        address,
        key
      }

      const hubAddress = globalAPIConfig.gaiaHubConfig.address

      const mockResponseBody = {
        publicURL: `https://gaia.blockstack.org/hub/${hubAddress}/foo-profile.json`
      }

      // mock gaia hub
      nock('https://hub.blockstack.org')
        .post(`/store/${hubAddress}/foo-profile.json`)
        .reply(200, mockResponseBody)

      const zoneFile = '$ORIGIN satoshi.id\n$TTL 3600\n_http._tcp\tIN\tURI\t10\t1\t' +
            `"https://gaia.blockstack.org/hub/${hubAddress}/foo-profile.json"\n\n`

      const identity = { zoneFile }

      uploadProfile(globalAPIConfig, identity, keyPair, 'test-data')
        .then(x => assert.equal(
          'https://gaia.blockstack.org/hub/15GAGiT2j2F1EzZrvjk3B8vBCfwVEzQaZx/foo-profile.json', x))
        .catch(() => assert.fail())
    })

    it('should upload to the default entry location if no zonefile', () => {
      const ecPair = ECPair.fromWIF(BitcoinKeyPairs.test1.wif)
      const address = ecPair.getAddress()
      const key = ecPair.d.toBuffer(32).toString('hex')
      const keyPair = {
        address,
        key
      }

      const mockResponseBody = {
        publicURL: `https://gaia.blockstack.org/hub/${address}/profile.json`
      }

      // mock gaia hub
      nock('https://hub.blockstack.org')
        .post(`/store/${address}/profile.json`)
        .reply(200, mockResponseBody)

      const identity = {}

      uploadProfile(globalAPIConfig, identity, keyPair, 'test-data')
        .then(x => assert.equal(
          `https://gaia.blockstack.org/hub/${address}/profile.json`, x))
        .catch(() => assert.fail())
    })

    it('should error if it cannot write to where the zonefile points', () => {
      const ecPair = ECPair.fromWIF(BitcoinKeyPairs.test1.wif)
      const address = ecPair.getAddress()
      const key = ecPair.d.toBuffer(32).toString('hex')
      const keyPair = {
        address,
        key
      }

      const zoneFile = '$ORIGIN satoshi.id\n$TTL 3600\n_http._tcp\tIN\tURI\t10\t1\t' +
            `"https://potato.blockstack.org/hub/${address}/foo-profile.json"\n\n`

      const identity = { zoneFile }

      uploadProfile(globalAPIConfig, identity, keyPair, 'test-data')
        .then(x => assert.equal(
          `https://gaia.blockstack.org/hub/${address}/profile.json`, x))
        .catch(() => assert.fail())
    })
  })
})
