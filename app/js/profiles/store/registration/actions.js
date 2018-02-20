import * as types from './types'
import { makeProfileZoneFile, transactions, config, network } from 'blockstack'
import { uploadProfile } from '../../../account/utils'
import { IdentityActions } from '../identity'
import { signProfileForUpload, authorizationHeaderValue } from '../../../utils'
import { DEFAULT_PROFILE } from '../../../utils/profile-utils'
import { isSubdomain, getNameSuffix } from '../../../utils/name-utils'
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

function registerName(api, domainName, identity, identityIndex,
                      ownerAddress, keypair, paymentKey = null) {
  logger.trace(`registerName: domainName: ${domainName}`)
  return dispatch => {
    logger.debug(`Signing a blank default profile for ${domainName}`)
    const signedProfileTokenData = signProfileForUpload(DEFAULT_PROFILE, keypair)

    dispatch(profileUploading())
    logger.trace(`Uploading ${domainName} profile...`)
    return uploadProfile(api, identity, keypair, signedProfileTokenData)
    .then((profileUrl) => {
      logger.trace(`Uploading ${domainName} profiled succeeded.`)
      const tokenFileUrl = profileUrl
      logger.debug(`tokenFileUrl: ${tokenFileUrl}`)

      logger.trace('Making profile zonefile...')
      const zoneFile = makeProfileZoneFile(domainName, tokenFileUrl)

      const nameIsSubdomain = isSubdomain(domainName)
      let registerUrl = api.registerUrl
      let nameSuffix = null
      if (nameIsSubdomain) {
        nameSuffix = getNameSuffix(domainName)
        logger.debug(`registerName: ${domainName} is a subdomain of ${nameSuffix}`)
        registerUrl = api.subdomains[nameSuffix].registerUrl
      } else {
        logger.debug(`registerName: ${domainName} is not a subdomain`)
      }

      if (nameIsSubdomain) {
        const registrationRequestBody = JSON.stringify({
          name: domainName.split('.')[0],
          owner_address: ownerAddress,
          zonefile: zoneFile
        })

        const requestHeaders = {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: authorizationHeaderValue(api.coreAPIPassword)
        }

        logger.trace(`Submitting registration for ${domainName} to ${registerUrl}`)

        dispatch(registrationSubmitting())

        return fetch(registerUrl, {
          method: 'POST',
          headers: requestHeaders,
          body: registrationRequestBody
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
            dispatch(IdentityActions.addUsername(identityIndex, domainName))
          }
        })
        .catch((error) => {
          logger.error('registerName: error POSTing registration to Core', error)
          dispatch(registrationError(error))
          throw error
        })
      } else {
        if (!paymentKey) {
          logger.error('registerName: payment key not provided for non-subdomain registration')
          return Promise.reject('Missing payment key')
        }

        const compressedKey = `${paymentKey}01`

        dispatch(registrationSubmitting())

        if (api.regTestMode) {
          logger.trace('Using regtest network')
          config.network = network.defaults.LOCAL_REGTEST
        }

        const myNet = config.network
        const coercedAddress = myNet.coerceAddress(ownerAddress)

        let preorderTx = ''
        let registerTx = ''

        return transactions.makePreorder(domainName, coercedAddress, compressedKey)
          .then((rawtx) => {
            preorderTx = rawtx
            return rawtx
          })
          .then((rawtx) => {
            myNet.modifyUTXOSetFrom(preorderTx)
            return rawtx
          })
          .then(() => 
            transactions.makeRegister(domainName, coercedAddress, compressedKey, zoneFile))
          .then((rawtx) => {
            registerTx = rawtx
            return rawtx
          })
          .then(() => {
            logger.debug(
              `Sending registration to transaction broadcaster at ${myNet.broadcastServiceUrl}`)
            return myNet.broadcastNameRegistration(preorderTx, registerTx, zoneFile)
          })
          .then((response) => {
            if (response.status) {
              logger.debug(`Successfully submitted registration for ${domainName}`)
              dispatch(registrationSubmitted())
              dispatch(IdentityActions.addUsername(identityIndex, domainName)) 
            } else {
              logger.error(response)
              dispatch(registrationError(response))
            }
          })
          .catch(error => {
            logger.error('registerName: error submitting name registration', error)
            dispatch(registrationError(error))
            throw new Error('Error submitting name registration')
          })
      }
    }).catch((error) => {
      logger.error('registerName: error uploading profile', error)
      dispatch(profileUploadError(error))
      throw error
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
