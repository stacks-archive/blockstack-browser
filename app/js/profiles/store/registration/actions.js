import * as types from './types'
import { makeProfileZoneFile, transactions, config, network } from 'blockstack'
import { uploadProfile } from '../../../account/utils'
import { IdentityActions } from '../identity'
import {
  signProfileForUpload, authorizationHeaderValue
} from '../../../utils'
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

function setOwnerKey(setOwnerKeyUrl, requestHeaders, keypair, nameIsSubdomain) {
  return new Promise((resolve, reject) => {
    if (nameIsSubdomain) {
      logger.debug('setOwnerKey: skipping setting core owner key for subdomain')
      resolve()
      return
    }

    // Core registers with an uncompressed address,
    // browser expects compressed addresses,
    // we need to add a suffix to indicate to core
    // that it should use a compressed addresses
    // see https://en.bitcoin.it/wiki/Wallet_import_format
    // and https://github.com/blockstack/blockstack-browser/issues/607
    const compressedPublicKeySuffix = '01'

    const setOwnerKeyRequestBody = JSON.stringify(`${keypair.key}${compressedPublicKeySuffix}`)

    logger.debug('setOwnerKey: setting core owner key')

    fetch(setOwnerKeyUrl, {
      method: 'PUT',
      headers: requestHeaders,
      body: setOwnerKeyRequestBody
    })
    .then(() => resolve())
    .catch((error) => reject(error))
  })
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

      const requestHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: authorizationHeaderValue(api.coreAPIPassword)
      }

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

      let registrationRequestBody = null

      if (nameIsSubdomain) {
        registrationRequestBody = JSON.stringify({
          name: domainName.split('.')[0],
          owner_address: ownerAddress,
          zonefile: zoneFile
        })
      } else {
        if (!paymentKey) {
          logger.error('registerName: payment key not provided for non-subdomain registration')
          return Promise.reject('Missing payment key')
        }

      }

      const compressedKey = `${paymentKey}01`

      dispatch(registrationSubmitting())

      logger.trace(`Submitting registration for ${domainName} to ${registerUrl}`)

      if (api.regTestMode) {
        logger.trace('Using regtest network')
        config.network = network.defaults.LOCAL_REGTEST
      }

      const myNet = config.network

      const coercedAddress = myNet.coerceAddress(ownerAddress)

      var preorderTx = ''
      var registerTx = ''

      return transactions.makePreorder(domainName, coercedAddress, compressedKey)
        .then((rawtx) => {
          preorderTx = rawtx
          return rawtx
        })
        .then((rawtx) => {
          myNet.modifyUTXOSetFrom(preorderTx)
          return rawtx
        })
        .then(() => transactions.makeRegister(domainName, coercedAddress, compressedKey, zoneFile))
        .then((rawtx) => {
          registerTx = rawtx
          return rawtx
        })
        .then(() => {
          logger.debug('Sending registration to transaction broadcast service')
          return myNet.broadcastNameRegistration(preorderTx, registerTx, zoneFile)
        })
        .then((resp) => {
          logger.debug(`Successfully submitted registration for ${domainName}`)
          dispatch(registrationSubmitted())
          dispatch(IdentityActions.addUsername(identityIndex, domainName)) 
        })
        .catch(error => {
          logger.error('registerName: error submitting name registration', error)
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
