import { AvailabilityActions } from '../../../../../app/js/profiles/store/availability'

describe('Availability Store: Sync Actions', () => {
  describe('checkingNameAvailability', () => {
    it('should return an action of type CHECKING_NAME_AVAILABILITY', () => {
      const expectedResult = {
        type: 'CHECKING_NAME_AVAILABILITY',
        domainName: 'satoshi.id'
      }
      const actualResult = AvailabilityActions.checkingNameAvailability('satoshi.id')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('nameAvailable', () => {
    it('should return an action of type NAME_AVAILABLE', () => {
      const expectedResult = {
        type: 'NAME_AVAILABLE',
        domainName: 'satoshi.id'
      }
      const actualResult = AvailabilityActions.nameAvailable('satoshi.id')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('nameUnavailable', () => {
    it('should return an action of type NAME_UNAVAILABLE', () => {
      const expectedResult = {
        type: 'NAME_UNAVAILABLE',
        domainName: 'satoshi.id'
      }
      const actualResult = AvailabilityActions.nameUnavailable('satoshi.id')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('nameAvailabilityError', () => {
    it('should return an action of type NAME_AVAILABILITIY_ERROR', () => {
      const expectedResult = {
        type: 'NAME_AVAILABILITIY_ERROR',
        domainName: 'satoshi.id',
        error: 'Broken!'
      }
      const actualResult = AvailabilityActions.nameAvailabilityError('satoshi.id', 'Broken!')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('checkingNamePrice', () => {
    it('should return an action of type CHECKING_NAME_PRICE', () => {
      const expectedResult = {
        type: 'CHECKING_NAME_PRICE',
        domainName: 'satoshi.id'
      }
      const actualResult = AvailabilityActions.checkingNamePrice('satoshi.id')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('namePrice', () => {
    it('should return an action of type NAME_PRICE', () => {
      const expectedResult = {
        type: 'NAME_PRICE',
        domainName: 'satoshi.id',
        price: 1.23
      }
      const actualResult = AvailabilityActions.namePrice('satoshi.id', 1.23)
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('namePriceError', () => {
    it('should return an action of type NAME_PRICE_ERROR', () => {
      const expectedResult = {
        type: 'NAME_PRICE_ERROR',
        domainName: 'satoshi.id',
        error: 'Broken!'
      }
      const actualResult = AvailabilityActions.namePriceError('satoshi.id', 'Broken!')
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
