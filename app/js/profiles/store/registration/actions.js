import * as types from './types'
import {
  makeProfileZoneFile,
  transactions,
  config,
  network,
  safety,
  hexStringToECPair,
  ecPairToAddress
} from 'blockstack'
import { uploadProfile } from '../../../account/utils'
import { IdentityActions } from '../identity'
import { signProfileForUpload, authorizationHeaderValue } from '@utils'
import { DEFAULT_PROFILE } from '@utils/profile-utils'
import { isSubdomain, getNameSuffix } from '@utils/name-utils'
import { notify } from 'reapop'
import log4js from 'log4js'
import bitcoin from 'bitcoinjs-lib'
import RIPEMD160 from 'ripemd160'

const logger = log4js.getLogger(__filename)

const profileUploading = () => ({
  type: types.PROFILE_UPLOADING
})

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
  logger.info('beforeRegister')
  return dispatch => {
    dispatch(registrationBeforeSubmit())
  }
}

async function registerSubdomain(
  api,
  domainName,
  identityIndex,
  ownerAddress,
  zoneFile
) {
  let nameSuffix = null

  nameSuffix = getNameSuffix(domainName)

  logger.debug(`registerName: ${domainName} is a subdomain of ${nameSuffix}`)

  const registerUrl = api.subdomains[nameSuffix].registerUrl

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

  logger.info(`Submitting registration for ${domainName} to ${registerUrl}`)

  const response = await fetch(registerUrl, {
    method: 'POST',
    headers: requestHeaders,
    body: registrationRequestBody
  })

  if (!response.ok) {
    logger.error(
      `Subdomain registrar responded with status code ${response.status}`
    )

    return Promise.reject({
      error: 'Failed to register username',
      status: response.status
    })
  }

  const responseText = await response.text()

  return JSON.parse(responseText)
}

const renewDomain = (
  name,
  ownerKey,
  ownerAddress,
  paymentKey,
  zoneFile,
  estimateOnly = false
) => async dispatch => {
  if (!paymentKey) {
    logger.error(
      'renewName: payment key not provided for non-subdomain registration'
    )
    return Promise.reject('Missing payment key')
  }
  const network = config.network

  const compressedPaymentKey = `${paymentKey}01`
  const compressedOwnerKey = `${ownerKey}01`
  const coercedAddress = network.coerceAddress(ownerAddress)

  const paymentKeyPair = hexStringToECPair(compressedPaymentKey);
  const paymentAddress = network.coerceAddress(ecPairToAddress(paymentKeyPair));

  const ownerUTXOsPromise = network.getUTXOs(ownerAddress);
  const paymentUTXOsPromise = network.getUTXOs(paymentAddress);

  const estimatePromise = Promise.all([
      ownerUTXOsPromise, paymentUTXOsPromise])
    .then(([ownerUTXOs, paymentUTXOs]) => {
        const numOwnerUTXOs = ownerUTXOs.length;
        const numPaymentUTXOs = paymentUTXOs.length;
        return transactions.estimateRenewal(
          name, network.coerceAddress(ownerAddress), 
          network.coerceAddress(ownerAddress),
          network.coerceAddress(paymentAddress), true, 
          numOwnerUTXOs + numPaymentUTXOs - 1);
      });

  const zonefileHashPromise = new Promise((resolve, reject) => {
    if (!!zoneFile) {
      const sha256 = bitcoin.crypto.sha256(zoneFile)
      const h = (new RIPEMD160()).update(sha256).digest('hex')
      resolve(h);
    } else {
      reject('No zone file provided')
    }
  })

  const txPromise = zonefileHashPromise.then((zfh) => {
    // Setting empty zonefile hash for now due to the issue with renewals in BTC
    const emptyZoneFileHash = ''
    return transactions.makeRenewal(
      name, ownerAddress, compressedOwnerKey, compressedPaymentKey, zoneFile, emptyZoneFileHash, false);
  })

  if (estimateOnly) {
    return estimatePromise
  }
  // return txPromise
  return txPromise.then((tx) => network.broadcastTransaction(tx));
}

function registerDomain(
  myNet,
  tx,
  domainName,
  identityIndex,
  ownerAddress,
  paymentKey,
  zoneFile
) {
  if (!paymentKey) {
    logger.error(
      'registerName: payment key not provided for non-subdomain registration'
    )
    return Promise.reject('Missing payment key')
  }

  const compressedKey = `${paymentKey}01`
  const coercedAddress = myNet.coerceAddress(ownerAddress)

  let preorderTx = ''
  let registerTx = ''

  return safety
    .addressCanReceiveName(ownerAddress)
    .then(canReceive => {
      if (!canReceive) {
        return Promise.reject(`Address ${ownerAddress} cannot receive names.`)
      }
      return safety.isNameValid(domainName)
    })
    .then(nameValid => {
      if (!nameValid) {
        return Promise.reject(`Name ${domainName} is not valid`)
      }
      return true
    })
    .then(() => tx.makePreorder(domainName, coercedAddress, compressedKey))
    .then(rawtx => {
      preorderTx = rawtx
      return rawtx
    })
    .then(rawtx => {
      myNet.modifyUTXOSetFrom(preorderTx)
      return rawtx
    })
    .then(() =>
      tx.makeRegister(domainName, coercedAddress, compressedKey, zoneFile)
    )
    .then(rawtx => {
      registerTx = rawtx
      return rawtx
    })
    .then(() => {
      // make sure we don't double-spend the register before it is broadcasted.
      myNet.modifyUTXOSetFrom(registerTx)
    })
    .then(() => {
      logger.debug(
        `Sending registration to transaction broadcaster at ${
          myNet.broadcastServiceUrl
        }`
      )
      return myNet.broadcastNameRegistration(preorderTx, registerTx, zoneFile)
    })
}

const registerName = (
  api,
  domainName,
  identity,
  identityIndex,
  ownerAddress,
  keypair,
  paymentKey = null
) => async dispatch => {
  logger.info(`registerName: domainName: ${domainName}`)
  logger.debug(`Signing a new profile for ${domainName}`)

  const profile = identity.profile || DEFAULT_PROFILE
  const signedProfileTokenData = signProfileForUpload(profile, keypair, api)
  dispatch(profileUploading())
  logger.info(`Uploading ${domainName} profile...`)
  try {
    const profileUrl = await uploadProfile(
      api,
      identity,
      keypair,
      signedProfileTokenData
    )
    logger.info(`Uploading ${domainName} profiled succeeded.`)
    const tokenFileUrl = profileUrl
    logger.debug(`tokenFileUrl: ${tokenFileUrl}`)
    logger.info('Making profile zonefile...')
    const zoneFile = makeProfileZoneFile(domainName, tokenFileUrl)
    const nameIsSubdomain = isSubdomain(domainName)
    dispatch(registrationSubmitting())
    if (nameIsSubdomain) {
      try {
        const res = await registerSubdomain(
          api,
          domainName,
          identityIndex,
          ownerAddress,
          zoneFile
        )

        if (res.error) {
          logger.error(res.error)
          let message =
            `Sorry, something went wrong while registering ${domainName}. ` +
            'You can try to register again later from your profile page. Some ' +
            'apps may be unusable until you do.'
          if (res.status === 409) {
            message =
              "Sorry, it looks like we weren't able to process your name registration. Please contact us at support@blockstack.org for help. Some apps may be unusable until you register an ID."
          }
          dispatch(registrationError(message))
          dispatch(
            notify({
              title: 'Username Registration Failed',
              message,
              status: 'error',
              dismissAfter: 6000,
              dismissible: true,
              closeButton: true,
              position: 'b'
            })
          )
        } else {
          logger.debug(`Successfully submitted registration for ${domainName}`)
          dispatch(registrationSubmitted())
          dispatch(IdentityActions.addUsername(identityIndex, domainName))
        }
      } catch (e) {
        logger.error('registerName: error POSTing registration to registrar', e)
        let message =
          `Sorry, something went wrong while registering ${domainName}. ` +
          'You can try to register again later from your profile page. Some ' +
          'apps may be unusable until you do.'
        if (e.status === 409) {
          message =
            "Sorry, it looks like we weren't able to process your name registration. Please contact us at support@blockstack.org for help. Some apps may be unusable until you register an ID."
        }
        dispatch(registrationError(message))
        throw new Error(message)
      }
    } else {
      // paid name
      if (api.regTestMode) {
        logger.info('Using regtest network')
        config.network = network.defaults.LOCAL_REGTEST
        // browser regtest environment uses 6270
        config.network.blockstackAPIUrl = 'http://localhost:6270'
      }
      const myNet = config.network

      try {
        const response = await registerDomain(
          myNet,
          transactions,
          domainName,
          identityIndex,
          ownerAddress,
          paymentKey,
          zoneFile
        )
        if (response.status && response.status !== 409) {
          logger.debug(`Successfully submitted registration for ${domainName}`)
          dispatch(registrationSubmitted())
          dispatch(IdentityActions.addUsername(identityIndex, domainName))
        } else {
          logger.error(response)
          dispatch(registrationError(response))
        }
      } catch (e) {
        logger.error('registerName: error uploading profile', e)
        dispatch(profileUploadError(e.message))
        throw e
      }
    }
  } catch (e) {
    logger.error('registerName: error', e)
    dispatch(registrationError(e.message))
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
  registrationError,
  registerSubdomain,
  registerDomain,
  renewDomain
}

export default RegistrationActions
