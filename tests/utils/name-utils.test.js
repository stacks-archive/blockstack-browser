import { isSubdomain, getNameSuffix } from '../../app/js/utils/name-utils'

describe('name-utils', () => {
  beforeEach(() => {
  })

  afterEach(() => {
  })

  describe('isSubdomain', () => {
    it('should return true for names that are subdomains', () => {
      const subdomain = 'foo.bar.id'
      assert(isSubdomain(subdomain))
    })

    it('should return false for names that are subdomains', () => {
      const subdomain = 'bar.id'
      assert(!isSubdomain(subdomain))
    })
  })

  describe('getNameSuffix', () => {
    it('should return the right parent domain', () => {
      const subdomain = 'foo.bar.id'
      const expectedResult = 'bar.id'
      const actualResult = getNameSuffix(subdomain)
      assert.equal(actualResult, expectedResult)
    })
  })
})
