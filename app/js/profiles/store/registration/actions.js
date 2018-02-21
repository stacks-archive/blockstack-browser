import * as types from './types'
import { makeProfileZoneFile, transactions, config, network, safety } from 'blockstack'
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

      dispatch(registrationSubmitting())

      if (nameIsSubdomain) {
        return registerSubdomain(api, domainName, identityIndex, ownerAddress, zoneFile) 
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
        if (api.regTestMode) {
          logger.trace('Using regtest network')
          config.network = network.defaults.LOCAL_REGTEST
          // browser regtest environment uses 6270
          config.network.blockstackAPIUrl = 'http://localhost:6270'
        }

        const myNet = config.network

        return registerDomain(myNet, transactions, domainName, identityIndex, ownerAddress, paymentKey, zoneFile)
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

function registerSubdomain(api, domainName, identityIndex, ownerAddress, zoneFile) {
  let nameSuffix = null
  nameSuffix = getNameSuffix(domainName)
  logger.debug(`registerName: ${domainName} is a subdomain of ${nameSuffix}`)
  let registerUrl = api.subdomains[nameSuffix].registerUrl

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

  return fetch(registerUrl, {
    method: 'POST',
    headers: requestHeaders,
    body: registrationRequestBody
  })
  .then((response) => response.text())
  .then((responseText) => JSON.parse(responseText))
}

function registerDomain(myNet, tx, domainName, identityIndex, ownerAddress, paymentKey, zoneFile) {
  if (!paymentKey) {
    logger.error('registerName: payment key not provided for non-subdomain registration')
    return Promise.reject('Missing payment key')
  }

  const compressedKey = `${paymentKey}01`
  const coercedAddress = myNet.coerceAddress(ownerAddress)

  let preorderTx = ''
  let registerTx = ''

  return safety.addressCanReceiveName(ownerAddress)
    .then((canReceive) => {
      if (!canReceive) {
        return Promise.reject(`Address ${ownerAddress} cannot receive names.`)
      }
      return safety.isNameValid(domainName)
    })
    .then((nameValid) => {
      if (!nameValid) {
        return Promise.reject(`Name ${domainName} is not valid`)
      }
    })
    .then(() => tx.makePreorder(domainName, coercedAddress, compressedKey))
    .then((rawtx) => {
      preorderTx = rawtx
      return rawtx
    })
    .then((rawtx) => {
      myNet.modifyUTXOSetFrom(preorderTx)
      return rawtx
    })
    .then(() =>
      tx.makeRegister(domainName, coercedAddress, compressedKey, zoneFile))
    .then((rawtx) => {
      registerTx = rawtx
      return rawtx
    })
    .then(() => {
      // make sure we don't double-spend the register before it is broadcasted.
      myNet.modifyUTXOSetFrom(registerTx)
    })
    .then(() => {
      logger.debug(
        `Sending registration to transaction broadcaster at ${myNet.broadcastServiceUrl}`)
      return myNet.broadcastNameRegistration(preorderTx, registerTx, zoneFile)
    })
}

const RegistrationActions = {
  profileUploading,
  profileUploadError,
  beforeRegister,
  registerName,
  registrationBeforeSubmit,
  registrationSubmitting,
  registrationSubmitted,
  registrationError,
  registerSubdomain,
  registerDomain
}

export default RegistrationActions
