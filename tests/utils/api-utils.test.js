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
})
