import assert from 'assert'
import { validateScopes, appRequestSupportsDirectHub } from '../../app/js/auth/utils'

describe('auth-utils', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('validateScopes', () => {
    it('should return true for empty scopes array', () => {
      const scopes = []
      assert(validateScopes(scopes))
    })

    it('should return false for a scope not on whitelist array', () => {
      const scopes = ['illegal_scope', 'store_write']
      assert(!validateScopes(scopes))
    })

    it('should return true for scopes in the whitelist', () => {
      let scopes = ['store_write']
      assert(validateScopes(scopes))

      scopes = ['email']
      assert(validateScopes(scopes))

      scopes = ['store_write', 'email']
      assert(validateScopes(scopes))

      scopes = ['email', 'store_write']
      assert(validateScopes(scopes))
    })

    it('should allow colleciton scopes', () => {
      const scopes = ['store_write', 'collection.contact']
      assert(validateScopes(scopes))
    })
  })

  describe('appRequestSupportsDirectHub', () => {
    it('should return true for authRequest versions >= 1.2.0', () => {
      assert(appRequestSupportsDirectHub({ version: '1.2.0', supports_hub_url: false }))
      assert(appRequestSupportsDirectHub({ version: '1.3.0', supports_hub_url: false }))
      assert(appRequestSupportsDirectHub({ version: '1.2.0.1', supports_hub_url: false }))
    })

    it('should return false for authRequests missing version', () => {
      assert(!appRequestSupportsDirectHub({}))
    })

    it('should return false for authRequests with older version', () => {
      assert(!appRequestSupportsDirectHub({ version: '1.1.0' }))
    })

    it('should return true for authRequests with supports_hub_url', () => {
      assert(appRequestSupportsDirectHub({ version: '1.1.0', supports_hub_url: true }))
      assert(appRequestSupportsDirectHub({ supports_hub_url: true }))
    })
  })
})
