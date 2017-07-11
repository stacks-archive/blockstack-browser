import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import { AccountActions } from '../account/store/account'
import { AvailabilityActions } from './store/availability'
import { IdentityActions } from './store/identity'
import { RegistrationActions } from './store/registration'

import { hasNameBeenPreordered, isABlockstackName } from '../utils/name-utils'
import roundTo from 'round-to'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/RegisterProfilePage.js')

const WALLET_URL = '/wallet/receive'
const STORAGE_URL = '/storage/providers'

function mapStateToProps(state) {
  return {
    username: '',
    localIdentities: state.profiles.identity.localIdentities,
    lookupUrl: state.settings.api.nameLookupUrl,
    registerUrl: state.settings.api.registerUrl,
    priceUrl: state.settings.api.priceUrl,
    identityAddresses: state.account.identityAccount.addresses,
    api: state.settings.api,
    identityKeypairs: state.account.identityAccount.keypairs,
    registration: state.profiles.registration,
    availability: state.profiles.availability,
    addressBalanceUrl: state.settings.api.zeroConfBalanceUrl,
    coreWalletBalance: state.account.coreWallet.balance,
    coreWalletAddress: state.account.coreWallet.address,
    coreAPIPassword: state.settings.api.coreAPIPassword,
    walletPaymentAddressUrl: state.settings.api.walletPaymentAddressUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    IdentityActions, AccountActions, RegistrationActions, AvailabilityActions), dispatch)
}

class RegisterPage extends Component {
  static propTypes = {
    username: PropTypes.string.isRequired,
    localIdentities: PropTypes.object.isRequired,
    lookupUrl: PropTypes.string.isRequired,
    registerUrl: PropTypes.string.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    registerName: PropTypes.func.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    registration: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired,
    addressBalanceUrl: PropTypes.string.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    coreWalletBalance: PropTypes.number.isRequired,
    coreWalletAddress: PropTypes.string,
    api: PropTypes.object.isRequired,
    checkNameAvailabilityAndPrice: PropTypes.func.isRequired,
    beforeRegister: PropTypes.func.isRequired,
    coreAPIPassword: PropTypes.string,
    createNewIdentityFromDomain: PropTypes.func.isRequired,
    routeParams: PropTypes.object,
    getCoreWalletAddress: PropTypes.func.isRequired,
    walletPaymentAddressUrl: PropTypes.string.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      registrationLock: false,
      username: props.username,
      nameCost: 0,
      alerts: [],
      type: 'person',
      tlds: {
        person: 'id',
        organization: 'corp'
      },
      nameLabels: {
        person: 'Username',
        organization: 'Domain'
      },
      zeroBalance: props.coreWalletBalance <= 0,
      storageConnected: this.props.api.dropboxAccessToken !== null
    }

    this.onChange = this.onChange.bind(this)
    this.registerIdentity = this.registerIdentity.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
    this.displayPricingAndAvailabilityAlerts = this.displayPricingAndAvailabilityAlerts.bind(this)
    this.displayRegistrationAlerts = this.displayRegistrationAlerts.bind(this)
    this.displayZeroBalanceAlert = this.displayZeroBalanceAlert.bind(this)
    this.findAddressIndex = this.findAddressIndex.bind(this)
    this.displayConnectStorageAlert = this.displayConnectStorageAlert.bind(this)
  }

  componentDidMount() {
    logger.trace('componentDidMount')
    if (this.props.coreWalletAddress !== null) {
      logger.debug('coreWalletAddress exists...refreshing core wallet balance...')
      this.props.refreshCoreWalletBalance(this.props.addressBalanceUrl,
        this.props.coreAPIPassword)
    } else {
      logger.debug('coreWalletAddress does not exist...getting core wallet address...')
      this.props.getCoreWalletAddress(this.props.walletPaymentAddressUrl,
        this.props.coreAPIPassword)
    }
    if (!this.state.storageConnected) {
      this.displayConnectStorageAlert()
    } else if (this.state.zeroBalance) {
      logger.debug('Zero balance...displaying alert...')
      this.displayZeroBalanceAlert()
    }
  }

  componentWillReceiveProps(nextProps) {
    logger.trace('componentWillReceiveProps')
    // Clear alerts
    this.setState({
      alerts: []
    })

    if (this.props.coreWalletAddress !== nextProps.coreWalletAddress) {
      logger.debug('coreWalletAddress changed. Refreshing core wallet balance...')
      this.props.refreshCoreWalletBalance(nextProps.addressBalanceUrl, this.props.coreAPIPassword)
    }

    const registration = nextProps.registration
    const availability = nextProps.availability
    const zeroBalance = this.props.coreWalletBalance <= 0
    const storageConnected = this.props.api.dropboxAccessToken !== null

    this.setState({
      zeroBalance,
      storageConnected
    })
    if (!storageConnected) {
      this.displayConnectStorageAlert()
    } else if (zeroBalance) {
      this.displayZeroBalanceAlert()
    } else if (registration.registrationSubmitting ||
      registration.registrationSubmitted ||
      registration.profileUploading ||
      registration.error) {
      this.displayRegistrationAlerts(registration)
    }
    else {
      this.displayPricingAndAvailabilityAlerts(availability)
    }

  }

  displayRegistrationAlerts(registration) {
    if(registration.error) {
      this.updateAlert('danger', 'There was a problem submitting your registration.')
    } else {
      if(registration.profileUploading)
        this.updateAlert('info', 'Signing & uploading your profile...')
      else if(registration.registrationSubmitting)
        this.updateAlert('info', 'Submitting your registration to your Blockstack Core node...')
      else if(registration.registrationSubmitted)
        this.updateAlert('success', 'Congrats! Your name is preordered! Registration will automatically complete over the next few hours.')
    }
  }

  displayPricingAndAvailabilityAlerts(availability) {
    let tld = this.state.tlds[this.state.type]
    const domainName = `${this.state.username}.${tld}`

    if(domainName === availability.lastNameEntered) {
      if(availability.names[domainName].error) {
        const error = availability.names[domainName].error
        console.error(error)
        this.updateAlert('danger', `There was a problem checking on price & availability of ${domainName}`)
      } else {
        if(availability.names[domainName].checkingAvailability)
          this.updateAlert('info', `Checking if ${domainName} available...`)
        else if(availability.names[domainName].available) {
          if(availability.names[domainName].checkingPrice) {
            this.updateAlert('info', `${domainName} is available! Checking price...`)
          } else {
            const price = availability.names[domainName].price
            if(price < this.props.coreWalletBalance) {
              const roundedUpPrice = roundTo.up(price, 3)
              this.updateAlert('info', `${domainName} costs ~${roundedUpPrice} btc to register.`)
            } else {
              const shortfall = price - this.props.coreWalletBalance
              this.updateAlert('danger', `Your wallet doesn't have enough money to buy ${domainName}. Please send at least ${shortfall} more bitcoin to your wallet.`, WALLET_URL)
            }
          }
        } else {
          this.updateAlert('danger', `${domainName} has already been registered.`)
        }
      }
    }
  }

  displayZeroBalanceAlert() {
    this.updateAlert('danger', `You need to deposit at least 0.01 bitcoins before you can register a username.<br> Click here to go to your wallet or send bitcoins directly to ${this.props.coreWalletAddress}`, WALLET_URL)
  }

  displayConnectStorageAlert() {
    this.updateAlert('danger', 'Please go to the Storage app and connect a storage provider.', STORAGE_URL)

  }

  onChange(event) {
    if (event.target.name === 'username') {
      this.props.beforeRegister() // clears any error & resets registration state

      const username = event.target.value.toLowerCase().replace(/\W+/g, '')
      const tld = this.state.tlds[this.state.type]
      const domainName = `${username}.${tld}`

      this.setState({
        username
      })

      if (username === '') {
        this.setState({
          alerts: []
        })
        return
      }

      if (this.timer) {
        logger.debug('Clearing existing timer')
        clearInterval(this.timer)
      }

      event.persist()
      const _this = this

      this.timer = setTimeout(() => {
        logger.trace('Timer fired')
        if (!isABlockstackName(domainName)) {
          _this.updateAlert('danger', `${domainName} Not valid Blockstack name`)
          return
        }
        this.props.checkNameAvailabilityAndPrice(this.props.api, domainName)
      },
      500) // wait 500ms after user stops typing to check availability
    }
  }

  updateAlert(alertStatus, alertMessage, url = null) {
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage,
        url
      }]
    })
  }

  findAddressIndex(address) {
    const identityAddresses = this.props.identityAddresses
    for (let i = 0; i < identityAddresses.length; i++) {
      if (identityAddresses[i] === address) {
        return i
      }
    }
    return null
  }

  registerIdentity(event) {
    logger.trace('registerIdentity')
    event.preventDefault()

    const ownerAddress = this.props.routeParams.index

    if (this.state.registrationLock) {
      return
    }

    this.setState({ registrationLock: true })

    const username = this.state.username

    if (username.length === 0) {
      this.updateAlert('danger', 'Name must have at least one character')
      return
    }

    const tld = this.state.tlds[this.state.type]
    const domainName = `${username}.${tld}`

    const nameHasBeenPreordered = hasNameBeenPreordered(domainName, this.props.localIdentities)

    if (nameHasBeenPreordered) {
      this.updateAlert('danger', 'Name has already been preordered')
      this.setState({ registrationLock: false })
    } else {
      const addressIndex = this.findAddressIndex(ownerAddress)

      const address = this.props.identityAddresses[addressIndex]
      const keypair = this.props.identityKeypairs[addressIndex]

      this.props.registerName(this.props.api, domainName, address, keypair)
      this.updateAlert('success', 'Name preordered! Waiting for registration confirmation.')
      this.setState({ registrationLock: false })
    }
  }

  render() {
    const tld = this.state.tlds[this.state.type]
    const nameLabel = this.state.nameLabels[this.state.type]
    return (
      <div>
        <div className="container vertical-split-content">
          <div className="col-sm-3">
          </div>
          <div className="col-sm-6">
            {
              this.state.alerts.map((alert, index) => {
                return (
                  <Alert
                    key={index} message={alert.message} status={alert.status} url={alert.url}
                  />
              )
              })}
            <fieldset className="form-group">
              <label className="capitalize">{nameLabel}</label>
              <div className="input-group">
                <input
                  name="username"
                  className="form-control"
                  placeholder={nameLabel}
                  value={this.state.username}
                  onChange={this.onChange}
                  disabled={this.state.zeroBalance || !this.state.storageConnected}
                />
                <span className="input-group-addon">.{tld}</span>
              </div>
            </fieldset>
            <div>
              <button
                className="btn btn-blue" onClick={this.registerIdentity}
                disabled={this.props.registration.preventRegistration || this.state.zeroBalance || !this.state.storageConnected}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage)
