import { PGPActions } from '../../../../../app/js/profiles/store/pgp'
import {
  LOADING_PGP_KEY,
  LOADED_PGP_KEY,
  LOADING_PGP_KEY_ERROR
} from '../../../../../app/js/profiles/store/pgp/types'

describe('PGP Store: Sync Actions', () => {
  describe('loadingPGPKey', () => {
    it('should return an action of type LOADING_PGP_KEY', () => {
      const expectedResult = {
        type: LOADING_PGP_KEY,
        identifier: 'ABCDEF'
      }
      const actualResult = PGPActions.loadingPGPKey('ABCDEF')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('loadingPGPKeyError', () => {
    it('should return an action of type LOADING_PGP_KEY_ERROR', () => {
      const expectedResult = {
        type: LOADING_PGP_KEY_ERROR,
        identifier: 'ABCDEF',
        error: 'Broken!'
      }
      const actualResult = PGPActions.loadingPGPKeyError('ABCDEF', 'Broken!')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('loadedPGPKey', () => {
    it('should return an action of type LOADED_PGP_KEY', () => {
      const expectedResult = {
        type: LOADED_PGP_KEY,
        identifier: 'ABCDEF',
        key: 'XYZ'
      }
      const actualResult = PGPActions.loadedPGPKey('ABCDEF', 'XYZ')
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
