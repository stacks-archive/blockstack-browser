import * as types from './types'
import { makeProfileZoneFile } from 'blockstack'
import { IdentityActions } from  '../identities'
import { uploadProfile } from '../../../storage/utils'
import {
  signProfileForUpload, authorizationHeaderValue
} from '../../../utils'
import { DEFAULT_PROFILE } from '../../../utils/profile-utils'
import log4js from 'log4js'

const logger = log4js.getLogger('profiles/store/registration/actions.js')


function profileUploading() {
  return {
    type: types.PROFILE_UPLOADING
  }
}

function profileUploadError(error) {
  return {
    type: types.PROFILE_UPLOAD_ERROR,
    error
  }
}

function registrationBeforeSubmit() {
  return {
    type: types.REGISTRATION_BEFORE_SUBMIT
  }
}

function registrationSubmitting() {
  return {
    type: types.REGISTRATION_SUBMITTING
  }
}

function registrationSubmitted() {
  return {
    type: types.REGISTRATION_SUBMITTED
  }
}

function registrationError(error) {
  return {
    type: types.REGISTRATION_ERROR,
    error
  }
}

function beforeRegister() {
  logger.trace('beforeRegister')
  return dispatch => {
    dispatch(registrationBeforeSubmit())
  }
}

function registerName(api, domainName, recipientAddress, keypair) {
  logger.trace(`registerName: domainName: ${domainName}`)
  return dispatch => {
    logger.debug(`Signing a blank default profile for ${domainName}`)

    const signedProfileTokenData = signProfileForUpload(DEFAULT_PROFILE, keypair)

    dispatch(profileUploading())
    logger.trace(`Uploading ${domainName} profile...`)
    return uploadProfile(api, domainName, signedProfileTokenData, true).then((profileUrl) => {
      logger.trace(`Uploading ${domainName} profiled succeeded.`)
      const tokenFileUrl = profileUrl
      logger.debug(`tokenFileUrl: ${tokenFileUrl}`)

      logger.trace('Making profile zonefile...')
      const zoneFile = makeProfileZoneFile(domainName, tokenFileUrl)

      const requestHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorizationHeaderValue(api.coreAPIPassword)
      }

      const requestBody = JSON.stringify({
        name: domainName,
        owner_address: recipientAddress,
        zonefile: zoneFile,
        min_confs: 0
      })

      dispatch(registrationSubmitting())
      logger.trace(`Submitting registration for ${domainName} to Core node at ${api.registerUrl}`)
      return fetch(api.registerUrl, {
        method: 'POST',
        headers: requestHeaders,
        body: requestBody
      })
        .then((response) => response.text())
        .then((responseText) => JSON.parse(responseText))
        .then((responseJson) => {
          if (responseJson.error) {
            logger.error(responseJson.error)
            dispatch(registrationError(responseJson.error))
          } else {
            logger.debug(`Successfully submitted registration for ${domainName}`)
            dispatch(registrationSubmitted())
            IdentityActions.createNewIdentityFromDomain(domainName)
          }
        })
        .catch((error) => {
          logger.error('registerName: error POSTing regitsration to Core', error)
          dispatch(registrationError(error))
        })
    }).catch((error) => {
      logger.error('registerName: error uploading profile', error)
      dispatch(profileUploadError(error))
    })
  }
}

const RegistrationActions = {
  profileUploading,
  profileUploadError,
  beforeRegister,
  registerName,
  registrationBeforeSubmit,
  registrationSubmitting,
  registrationSubmitted,
  registrationError
}

export default RegistrationActions
