// @flow
import assert from 'assert'
import { validateScopes } from '../../app/js/auth/utils'

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
      const scopes = ['illegal_scope']
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
  })
})
