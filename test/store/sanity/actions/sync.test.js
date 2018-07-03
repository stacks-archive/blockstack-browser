import { SanityActions } from '../../../../app/js/store/sanity'
import {
  CORE_API_PASSWORD_NOT_VALID,
  CORE_API_PASSWORD_VALID,
  CORE_IS_NOT_RUNNING,
  CORE_IS_RUNNING
} from '../../../../app/js/store/sanity/types'

describe('Sanity Store: Sync Actions', () => {
  describe('coreApiPasswordIsNotValid', () => {
    it('should return an action of type CORE_API_PASSWORD_NOT_VALID', () => {
      const expectedResult = {
        type: CORE_API_PASSWORD_NOT_VALID
      }
      const actualResult = SanityActions.coreApiPasswordIsNotValid()
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('coreApiPasswordIsValid', () => {
    it('should return an action of type CORE_API_PASSWORD_VALID', () => {
      const expectedResult = {
        type: CORE_API_PASSWORD_VALID
      }
      const actualResult = SanityActions.coreApiPasswordIsValid()
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('coreIsNotRunning', () => {
    it('should return an action of type CORE_IS_NOT_RUNNING', () => {
      const expectedResult = {
        type: CORE_IS_NOT_RUNNING
      }
      const actualResult = SanityActions.coreIsNotRunning()
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('coreIsRunning', () => {
    it('should return an action of type CORE_IS_RUNNING', () => {
      const expectedResult = {
        type: CORE_IS_RUNNING
      }
      const actualResult = SanityActions.coreIsRunning()
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
