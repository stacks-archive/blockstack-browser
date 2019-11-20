import {
  hasNameBeenPreordered,
  isNameAvailable,
  isSubdomain,
  getNameSuffix,
  getNamePrices
} from '../../app/js/utils/name-utils'

describe('name-utils', () => {
  describe('hasNameBeenPreordered', () => {
    it('should return true if name has been preordered', () => {
      const domainName = 'satoshi.nakamoto'
      const localIdentities = [{ username: domainName }]

      assert(hasNameBeenPreordered(domainName, localIdentities))
    })

    it('should return false if name has not been preordered', () => {
      const domainName = 'satoshi.nakamoto'
      const localIdentities = []

      assert(!hasNameBeenPreordered(domainName, localIdentities))
    })
  })

  describe('isNameAvailable', () => {
    it('should return a promise that resolves to true if name is available', () =>{
      const lookupUrl = '/v1/names/{name}'
      const domainName = 'roger.ver'

      sandbox.stub(global, 'fetch').resolves({ ok: false, status: 404 })

      return isNameAvailable(lookupUrl, domainName)
        .then((res) => assert(res))
        .catch(() => assert(false))
    })

    it('should return a promise that resolves to false if name is not available', () =>{
      const lookupUrl = '/v1/names/{name}'
      const domainName = 'satoshi.nakamoto'

      sandbox.stub(global, 'fetch').resolves({ ok: true, status: 200 })

      return isNameAvailable(lookupUrl, domainName)
        .then((res) => assert(!res))
        .catch(() => assert(false))
    })

    it('should return a promise that rejects with an error if something goes wrong', () =>{
      const lookupUrl = '/v1/names/{name}'
      const domainName = 'satoshi.nakamoto'

      sandbox.stub(global, 'fetch').resolves({ ok: false, status: 500 })

      return isNameAvailable(lookupUrl, domainName)
        .then(() => assert(false))
        .catch((error) => assert.equal(error.message, '500'))
    })
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

    it('should throw an error argument is not a subdomain', () => {
      const subdomain = 'satoshi.id'

      assert.throws(() => getNameSuffix(subdomain), Error, 'Only works with subdomains')
    })
  })

  describe('getNamePrices', () => {
    it('should return a promise that rejects if domain name passed in is not valid', () => {
      const priceUrl = '/v1/prices/names/{name}'
      const domainName = 'satoshi'

      return getNamePrices(priceUrl, domainName)
        .then(() => assert(false))
        .catch((error) => assert.equal(error.message, 'Not a Blockstack name'))
    })

    it('should return a promise that resolves with the price of the name', () =>{
      const priceUrl = '/v1/prices/names/{name}'
      const domainName = 'satoshi.nakamoto'
      const expectedResponse = {
         name_price: {
          satoshis: 100000,
          btc: 0.001
        }
      }

      sandbox.stub(global, 'fetch').resolves({
        ok: true,
        text: sandbox.stub().resolves(JSON.stringify(expectedResponse))
      })

      return getNamePrices(priceUrl, domainName)
        .then((res) => assert.deepEqual(res, expectedResponse))
        .catch((error) => assert(false, error))
    })

    it('should return a promise that rejects with an error if something goes wrong', () =>{
      const priceUrl = '/v1/prices/names/{name}'
      const domainName = 'satoshi.nakamoto'
      const expectedResponse = {
        name_price: {
          satoshis: 100000,
          btc: 0.001
        }
      }

      sandbox.stub(global, 'fetch').resolves({
        ok: false,
        text: sandbox.stub().resolves(JSON.stringify(expectedResponse))
      })

      return getNamePrices(priceUrl, domainName)
        .then(() => assert(false))
        .catch((error) => assert.equal(error.message, 'error parsing price result'))
    })
  })
})
