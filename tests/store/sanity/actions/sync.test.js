import { SanityActions } from '../../../../app/js/store/sanity'

describe('Sanity Store: Sync Actions', () => {
  describe('coreIsNotRunning', () => {
    it('should return an action of type CORE_IS_NOT_RUNNING', () => {
      const expectedResult = {
        type: 'CORE_IS_NOT_RUNNING'
      }
      const actualResult = SanityActions.coreIsNotRunning()
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('coreIsRunning', () => {
    it('should return an action of type CORE_IS_RUNNING', () => {
      const expectedResult = {
        type: 'CORE_IS_RUNNING'
      }
      const actualResult = SanityActions.coreIsRunning()
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
