import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from '../../../account/store/account'
import { AvailabilityActions } from '../../store/availability'
import { IdentityActions } from '../../store/identity'
import { RegistrationActions } from '../../store/registration'
import { hasNameBeenPreordered, isSubdomain } from '../../../utils/name-utils'
import { findAddressIndex } from '../../../utils'
import roundTo from 'round-to'
import { QRCode } from 'react-qr-svg'


import log4js from 'log4js'

const logger = log4js.getLogger('profiles/components/registration/RegistrationSelectView.js')
const CHECK_FOR_PAYMENT_INTERVAL = 10000


function mapStateToProps(state) {
  return {
    api: state.settings.api,
    availability: state.profiles.availability,
    walletBalance: state.account.coreWallet.balance,
    walletAddress: state.account.coreWallet.address,
    identityKeypairs: state.account.identityAccount.keypairs,
    identityAddresses: state.account.identityAccount.addresses,
    registration: state.profiles.registration,
    localIdentities: state.profiles.identity.localIdentities,
    balanceUrl: state.settings.api.zeroConfBalanceUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    IdentityActions, AccountActions, RegistrationActions, AvailabilityActions), dispatch)
}

class AddUsernameSelectPage extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
    api: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired,
    getCoreWalletAddress: PropTypes.func.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    walletBalance: PropTypes.number.isRequired,
    walletAddress: PropTypes.string,
    registerName: PropTypes.func.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    registration: PropTypes.object.isRequired,
    localIdentities: PropTypes.object.isRequired,
    balanceUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    const ownerAddress = this.props.routeParams.index
    const name = this.props.routeParams.name
    const availableNames = this.props.availability.names
    const nameAvailabilityObject = availableNames[name]
    if (!nameAvailabilityObject) {
      logger.error(`componentDidMount: not sure if ${name} is available.`)
      props.router.push(`/profiles/i/add-username/${ownerAddress}/search`)
    }

    const nameHasBeenPreordered = hasNameBeenPreordered(name, props.localIdentities)
    if (nameHasBeenPreordered) {
      logger.error(`constructor: Name ${name} has already been preordered.`)
      props.router.push('/profiles')
    }


    const nameIsSubdomain = isSubdomain(name)
    let enoughMoney = false
    let price = 0
    if (nameAvailabilityObject) {
      price = nameAvailabilityObject.price
    }
    price = roundTo.up(price, 3)
    const walletBalance = this.props.walletBalance

    if (nameIsSubdomain || (walletBalance > price)) {
      enoughMoney = true
    }

    const that = this
    if (!enoughMoney) {
      this.paymentTimer = setInterval(() => {
        logger.debug('paymentTimer: calling refreshCoreWalletBalance...')
        that.props.refreshCoreWalletBalance(that.props.balanceUrl,
          that.props.api.coreAPIPassword)
      }, CHECK_FOR_PAYMENT_INTERVAL)
    }
    this.state = {
      ownerAddress,
      name,
      nameIsSubdomain,
      enoughMoney,
      registrationInProgress: false
    }
    this.register = this.register.bind(this)
  }

  componentDidMount() {
    logger.trace('componentDidMount')
    this.props.getCoreWalletAddress(this.props.api.walletPaymentAddressUrl,
      this.props.api.coreAPIPassword)
    this.props.refreshCoreWalletBalance(this.props.balanceUrl,
      this.props.api.coreAPIPassword)
  }

  componentWillReceiveProps(nextProps) {
    const registration = nextProps.registration

    if (this.state.registrationInProgress && registration.registrationSubmitted) {
      logger.debug('componentWillReceiveProps: registration submitted! redirecting...')
      this.props.router.push('/profiles') // TODO this should go to the status page
    }


    const name = nextProps.routeParams.name
    const availableNames = this.props.availability.names
    const nameAvailabilityObject = availableNames[name]
    const nameIsSubdomain = isSubdomain(name)
    let enoughMoney = false
    let price = 0
    if (nameAvailabilityObject) {
      price = nameAvailabilityObject.price
    }
    price = roundTo.up(price, 3)
    const walletBalance = this.props.walletBalance

    if (nameIsSubdomain || (walletBalance > price)) {
      enoughMoney = true
    }

    if (enoughMoney && !this.state.enoughMoney) {
      logger.debug('componentWillReceiveProps: payment received')
      logger.debug('componentWillReceiveProps: clearing payment timer')
      clearTimeout(this.paymentTimer)
      this.register()
    }
    this.setState({
      nameIsSubdomain,
      enoughMoney
    })
  }

  register(event) {
    logger.trace('register')

    if (event) {
      event.preventDefault()
    }

    this.setState({
      registrationInProgress: true
    })
    const ownerAddress = this.props.routeParams.index
    const name = this.props.routeParams.name
    const nameHasBeenPreordered = hasNameBeenPreordered(name, this.props.localIdentities)

    if (nameHasBeenPreordered) {
      logger.error(`register: Name ${name} has already been preordered`)
    } else {
      const addressIndex = findAddressIndex(ownerAddress, this.props.identityAddresses)

      if (!addressIndex) {
        logger.error(`register: can't find address ${ownerAddress}`)
      }

      logger.debug(`register: ${ownerAddress} index is ${addressIndex}`)

      const address = this.props.identityAddresses[addressIndex]

      if (ownerAddress !== address) {
        logger.error(`register: Address ${address} at index ${addressIndex} doesn't match owner address ${ownerAddress}`)
      }

      const keypair = this.props.identityKeypairs[addressIndex]

      const nameTokens = name.split('.')
      const nameSuffix = name.split(nameTokens[0])
      const nameIsSubdomain = isSubdomain(name)

      logger.debug(`register: ${name} has name suffix ${nameSuffix}`)
      logger.debug(`register: is ${name} a subdomain? ${nameIsSubdomain}`)

      this.props.registerName(this.props.api, name, address, addressIndex, keypair)
      logger.debug(`register: ${name} preordered! Waiting for registration confirmation.`)
    }
  }

  render() {
    const name = this.props.routeParams.name
    const availableNames = this.props.availability.names
    const nameAvailabilityObject = availableNames[name]
    const nameIsSubdomain = isSubdomain(name)
    let enoughMoney = false
    let price = 0
    if (nameAvailabilityObject) {
      price = nameAvailabilityObject.price
    }
    price = roundTo(price, 3)
    const walletBalance = this.props.walletBalance

    if (nameIsSubdomain || (walletBalance > price)) {
      enoughMoney = true
    }

    const walletAddress = this.props.walletAddress

    const registrationInProgress = this.state.registrationInProgress

    return (
      <div>
        {enoughMoney ?
          <div style={{ textAlign: 'center' }}>
          {nameIsSubdomain ?
            <div>
              <h3 className="modal-heading">Are you sure you want to register <strong>{name}</strong>?</h3>
              <p><strong>{name}</strong> is a subdomain that is free to register.</p>
              <div>
                <button
                  onClick={this.register}
                  className="btn btn-primary"
                  disabled={registrationInProgress}
                >
                  {registrationInProgress ?
                    <span>Registering...</span>
                    :
                    <span>Register</span>
                  }
                </button>
                <br />
                {registrationInProgress ?
                  null
                  :
                  <Link to="/profiles">
                    Cancel
                  </Link>
                }
              </div>
            </div>
            :
            <div>
              <h3 className="modal-heading">
                Are you sure you want to buy <strong>{name}</strong>?
              </h3>
              <p>Purchasing <strong>{name}</strong> will spend {price} bitcoins
              from your wallet.</p>
              <div
                style={{ textAlign: 'center' }}
              >
                <button
                  onClick={this.register}
                  className="btn btn-primary"
                  disabled={registrationInProgress}
                >
                  {registrationInProgress ?
                    <span>Buying...</span>
                    :
                    <span>Buy</span>
                  }
                </button>
                <br />
                {registrationInProgress ?
                  null
                  :
                  <Link to="/profiles">
                    Cancel
                  </Link>
                }
              </div>
            </div>
          }
          </div>
          :
          <div style={{ textAlign: 'center' }}>
            <h3 className="modal-heading">Buy {name}</h3>
            <p>Send at least {price} bitcoins to your wallet:<br />
              <strong>{this.props.walletAddress}</strong>
            </p>
            <div style={{ textAlign: 'center' }}>
              {walletAddress ?
                <QRCode
                  style={{ width: 256 }}
                  value={this.props.walletAddress}
                />
                :
                null
              }
              <div>
                <div className="progress">
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    aria-valuenow="100"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: '100%' }}
                  >
                  Waiting for payment...
                  </div>
                </div>
                <Link to="/profiles">
                  Cancel
                </Link>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUsernameSelectPage)
