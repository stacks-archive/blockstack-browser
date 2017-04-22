import { RegistrationActions } from '../../../../../app/js/profiles/store/registration'

describe('Registration Store: Sync Actions', () => {
  describe('profileUploading', () => {
    it('should return an action of type PROFILE_UPLOADING', () => {
      const expectedResult = {
        type: 'PROFILE_UPLOADING'
      }
      const actualResult = RegistrationActions.profileUploading()
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('profileUploadError', () => {
    it('should return an action of type PROFILE_UPLOAD_ERROR', () => {
      const expectedResult = {
        type: 'PROFILE_UPLOAD_ERROR',
        error: 'Broken'
      }
      const actualResult = RegistrationActions.profileUploadError('Broken')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('registrationSubmitting', () => {
    it('should return an action of type REGISTRATION_SUBMITTING', () => {
      const expectedResult = {
        type: 'REGISTRATION_SUBMITTING'
      }
      const actualResult = RegistrationActions.registrationSubmitting()
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('registrationSubmitted', () => {
    it('should return an action of type REGISTRATION_SUBMITTED', () => {
      const expectedResult = {
        type: 'REGISTRATION_SUBMITTED'
      }
      const actualResult = RegistrationActions.registrationSubmitted()
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('registrationError', () => {
    it('should return an action of type REGISTRATION_ERROR', () => {
      const expectedResult = {
        type: 'REGISTRATION_ERROR',
        error: 'Oops!'
      }
      const actualResult = RegistrationActions.registrationError('Oops!')
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
