import { getCoreAPIPasswordFromURL,
  getLogServerPortFromURL,
  setCoreStorageConfig } from '../../app/js/utils/api-utils'

import { DEFAULT_PROFILE } from '../../app/js/utils/profile-utils'

import nock from 'nock'


describe('api-utils', () => {
  beforeEach(() => {
    global.origWindow = global.window
    global.window = { // mock window for hash-handler
      location: {
        hash: '#'
      },
      addEventListener: () => {
        // do nothing
      }
    }
  })

  afterEach(() => {
    nock.cleanAll()
    global.window = global.origWindow
  })
  describe('getCoreAPIPasswordFromURL()', () => {
    it('should return the password', () => {
      const hash = '#coreAPIPassword=abc123&logServerPort=8333'
      window.location.hash = hash
      assert.equal(window.location.hash, '#coreAPIPassword=abc123&logServerPort=8333')
      assert.equal(getCoreAPIPasswordFromURL(), 'abc123')
    })

    it('should be null if password is off', () => {
      const hash = '#coreAPIPassword=off'
      window.location.hash = hash
      assert.equal(getCoreAPIPasswordFromURL(), null)
    })

    it('should be null if password parameter does not exist', () => {
      const hash = ''
      window.location.hash = hash
      assert.equal(getCoreAPIPasswordFromURL(), null)
    })
  })

  describe('getLogServerPortFromURL()', () => {
    it('should return the port', () => {
      const hash = '#coreAPIPassword=abc123&logServerPort=8333'
      window.location.hash = hash
      assert.equal(window.location.hash, '#coreAPIPassword=abc123&logServerPort=8333')
      assert.equal(getLogServerPortFromURL(), '8333')
    })

    it('should be null if port is off', () => {
      const hash = '#logServerPort=off'
      window.location.hash = hash
      assert.equal(getLogServerPortFromURL(), null)
    })

    it('should be null if port parameter does not exist', () => {
      const hash = ''
      window.location.hash = hash
      assert.equal(getLogServerPortFromURL(), null)
    })
  })

  describe('setCoreStorageConfig', () => {
    it('should have core initialize storage and not update profile', () => {
      const expectedBody =  JSON.stringify({ driver_config: { token: 'dropboxtoken' } })

      const response = '{"index_url": "https://www.dropbox.com/s/faws3zg4silbnip/profile.json?dl=1"}'
      const expectedResult = 'OK'

      const api = {
        coreAPIPassword: '999',
        dropboxAccessToken: 'dropboxtoken',
        hostedDataLocation: 'dropbox'
      }

      // mock core
      const core = nock('http://localhost:6270')
      .post('/v1/node/drivers/storage/dropbox?index=1', expectedBody)
      .reply(200, response)

      return setCoreStorageConfig(api).then((actualResult) => {
        assert.deepEqual(actualResult, expectedResult)
        core.done() // will throw AssertionError if mock not called
      })
    })

    it('should have core initialize storage and update profile with index_url', () => {
      const identityIndex = '0'
      const identityAddress = '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk'
      const profile = Object.assign({}, DEFAULT_PROFILE)
      const profileSigningKeypair = { key: 'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
        keyID: '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
        address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
        appsNodeKey: 'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarxXMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
        salt: 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e' }

      const api = {
        coreAPIPassword: '999',
        dropboxAccessToken: 'dropboxtoken',
        hostedDataLocation: 'dropbox'
      }

      const expectedBody =  JSON.stringify({ driver_config: { token: 'dropboxtoken' } })

      const response = '{"index_url": "https://www.dropbox.com/s/faws3zg4silbnip/profile.json?dl=1"}'
      const expectedResult = null // runs null because this isn't the first upload of the profile
      // TODO update test to reflect implementation & make it pass

      // mock core
      const core = nock('http://localhost:6270')
      .post('/v1/node/drivers/storage/dropbox?index=1', expectedBody)
      .reply(200, response)


      // mock dropbox
      const dropbox = nock('https://content.dropboxapi.com').options('/2/files/upload')
      .reply(200)
      .post('/2/files/upload')
      .reply(200, {
        name: 'profile.json',
        path_lower: '/1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk/0/profile.json',
        path_display: '/1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk/0/profile.json',
        id: 'id:tFN0g-hnfJAAAAAAAAAAdA',
        client_modified: '2017-04-22T12:53:25Z',
        server_modified: '2017-04-22T12:53:26Z',
        rev: 'c0524a1d34',
        size: 1353,
        content_hash: 'a9b121c41aa35d580e22798b4863c973a34dce2b8b6498304913f9bf1733045c'
      })

      return setCoreStorageConfig(api,
        identityAddress, identityIndex, profile, profileSigningKeypair).then((actualResult) => {
          assert.deepEqual(actualResult, expectedResult)
          core.done() // will throw AssertionError if mock not called
          dropbox.done() // will throw AssertionError if mock not called
        })
    }).timeout(5000)
  })
})
