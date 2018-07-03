import {
  RegistrationActions, RegistrationReducer
} from '../../../../app/js/profiles/store/registration'

const initialState = {

}

describe('Registration Store: RegistrationReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      RegistrationReducer(undefined, {}),
      initialState)
  })

  describe('Registration Store: RegistrationReducer: successful registration', () => {
    let actualState = RegistrationReducer(undefined, {})

    it('should indicate profile is uploading & prevent additional registrations', () => {
      const expectedState = {
        preventRegistration: true,
        error: null,
        profileUploading: true
      }
      const action = RegistrationActions.profileUploading()
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })

    it('should indicate is being submitted to core & prevent additional registrations', () => {
      const expectedState = {
        preventRegistration: true,
        error: null,
        profileUploading: false,
        registrationSubmitting: true
      }
      const action = RegistrationActions.registrationSubmitting()
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })

    it('should indicate has been submitted to core & allow additional registrations', () => {
      const expectedState = {
        preventRegistration: false,
        error: null,
        profileUploading: false,
        registrationSubmitting: false,
        registrationSubmitted: true
      }
      const action = RegistrationActions.registrationSubmitted()
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })
  })

  describe('Registration Store: RegistrationReducer: problem uploading profile', () => {
    let actualState = RegistrationReducer(undefined, {})

    it('should indicate profile is uploading & prevent additional registrations', () => {
      const expectedState = {
        preventRegistration: true,
        error: null,
        profileUploading: true
      }
      const action = RegistrationActions.profileUploading()
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })

    it('should indicate profile uploading failed, the error and allow registrations', () => {
      const expectedState = {
        preventRegistration: false,
        error: 'Upload failed',
        profileUploading: false
      }
      const action = RegistrationActions.profileUploadError('Upload failed')
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })
  })

  describe('Registration Store: RegistrationReducer: successful profile upload, error submitting regitsration to core', () => {
    let actualState = RegistrationReducer(undefined, {})

    it('should indicate profile is uploading & prevent additional registrations', () => {
      const expectedState = {
        preventRegistration: true,
        error: null,
        profileUploading: true
      }
      const action = RegistrationActions.profileUploading()
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })

    it('should indicate error submitting to core, the error & allow registrations', () => {
      const expectedState = {
        preventRegistration: true,
        error: null,
        profileUploading: false,
        registrationSubmitting: true
      }
      const action = RegistrationActions.registrationSubmitting()
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })

    it('should indicate had been submitting to core,  allow additional registrations', () => {
      const expectedState = {
        preventRegistration: false,
        error: 'Core error',
        profileUploading: false,
        registrationSubmitting: false
      }
      const action = RegistrationActions.registrationError('Core error')
      actualState = RegistrationReducer(actualState, action)
      assert.deepEqual(actualState, expectedState)
    })
  })
})
