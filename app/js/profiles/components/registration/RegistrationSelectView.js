import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from '../../../account/store/account'
import { AvailabilityActions } from '../../store/availability'
import { IdentityActions } from '../../store/identity'
import { RegistrationActions } from '../../store/registration'
import { hasNameBeenPreordered, isSubdomain } from '../../../utils/name-utils'
import { decryptBitcoinPrivateKey } from '../../../utils'
import roundTo from 'round-to'
import { QRCode } from 'react-qr-svg'
import Alert from '../../../components/Alert'
import InputGroup from '../../../components/InputGroup'
import log4js from 'log4js'

const logger = log4js.getLogger('profiles/components/registration/RegistrationSelectView.js')
const CHECK_FOR_PAYMENT_INTERVAL = 10000
export const PRICE_BUFFER = 0.0005 // btc
function mapStateToProps(state) {
  return {
    api: state.settings.api,
    availability: state.profiles.availability,
    addresses: state.account.bitcoinAccount.addresses,
    identityKeypairs: state.account.identityAccount.keypairs,
    identityAddresses: state.account.identityAccount.addresses,
    registration: state.profiles.registration,
    localIdentities: state.profiles.identity.localIdentities,
    balanceUrl: state.settings.api.zeroConfBalanceUrl,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    balances: state.account.bitcoinAccount.balances,
    insightUrl: state.settings.api.insightUrl
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
    registerName: PropTypes.func.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    registration: PropTypes.object.isRequired,
    localIdentities: PropTypes.array.isRequired,
    balanceUrl: PropTypes.string.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired,
    addresses: PropTypes.array.isRequired,
    balances: PropTypes.object.isRequired,
    insightUrl: PropTypes.string.isRequired,
    refreshBalances: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    const index = this.props.routeParams.index
    const name = this.props.routeParams.name
    const availableNames = this.props.availability.names
    const nameAvailabilityObject = availableNames[name]
    if (!nameAvailabilityObject) {
      logger.error(`componentDidMount: not sure if ${name} is available.`)
      props.router.push(`/profiles/i/add-username/${index}/search`)
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
    const walletBalance = this.props.balances.total

    if (nameIsSubdomain || (walletBalance >= price)) {
      enoughMoney = true
    }

    const that = this
    if (!enoughMoney) {
      this.paymentTimer = setInterval(() => {
        logger.debug('paymentTimer: calling refreshBalances...')
        that.props.refreshBalances(that.props.insightUrl, that.props.addresses,
              that.props.api.coreAPIPassword)
      }, CHECK_FOR_PAYMENT_INTERVAL)
    }
    this.state = {
      index,
      name,
      nameIsSubdomain,
      enoughMoney,
      registrationInProgress: false,
      alerts: [],
      password: '',
      acceptedWarning: false
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.register = this.register.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  componentDidMount() {
    logger.trace('componentDidMount')
    this.props.refreshBalances(this.props.insightUrl, this.props.addresses,
          this.props.api.coreAPIPassword)
  }

  componentWillReceiveProps(nextProps) {
    const registration = nextProps.registration
    const name = nextProps.routeParams.name
    const index = nextProps.routeParams.index

    if (this.state.registrationInProgress && registration.registrationSubmitted) {
      logger.debug('componentWillReceiveProps: registration submitted! redirecting...')
      this.props.router.push(`/profiles/i/add-username/${index}/submitted/${name}`)
    } else if (registration.registrationError) {
      this.setState({
        registrationInProgress: false
      })
      this.updateAlert('danger', registration.registrationError)
    }

    const availableNames = this.props.availability.names
    const nameAvailabilityObject = availableNames[name]
    const nameIsSubdomain = isSubdomain(name)
    let enoughMoney = false
    let price = 0
    if (nameAvailabilityObject) {
      price = nameAvailabilityObject.price
    }
    price = roundTo.up(price, 3)
    const walletBalance = this.props.balances.total

    if (nameIsSubdomain || (walletBalance >= price)) {
      enoughMoney = true
    }

    if (enoughMoney && !this.state.enoughMoney) {
      logger.debug('componentWillReceiveProps: payment received')
      logger.debug('componentWillReceiveProps: clearing payment timer')
      clearTimeout(this.paymentTimer)
    }
    this.setState({
      nameIsSubdomain,
      enoughMoney
    })
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value
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
    const index = this.props.routeParams.index
    const name = this.props.routeParams.name
    const nameHasBeenPreordered = hasNameBeenPreordered(name, this.props.localIdentities)
    const identity = this.props.localIdentities[index]
    if (nameHasBeenPreordered) {
      logger.error(`register: Name ${name} has already been preordered`)
    } else {
      logger.debug(`register: Will try to register ${name} for identity ${index}`)

      const address = this.props.identityAddresses[index]
      const ownerAddress = identity.ownerAddress
      if (ownerAddress !== address) {
        this.setState({
          registrationInProgress: false
        })
        logger.error(`register: ${address} @ ${index} doesn't match owner ${ownerAddress}`)
        this.updateAlert('danger', 'There is a problem with your account.')
      }

      const keypair = this.props.identityKeypairs[index]

      const nameTokens = name.split('.')
      const nameSuffix = name.split(nameTokens[0])
      const nameIsSubdomain = isSubdomain(name)

      logger.debug(`register: ${name} has name suffix ${nameSuffix}`)
      logger.debug(`register: is ${name} a subdomain? ${nameIsSubdomain}`)

      if (nameIsSubdomain) {
        this.props.registerName(this.props.api, name, index, address, keypair)
      } else {
        const password = this.state.password
        const encryptedBackupPhrase = this.props.encryptedBackupPhrase
        decryptBitcoinPrivateKey(password, encryptedBackupPhrase)
        .then((paymentKey) => {
          this.props.registerName(this.props.api, name, index, address, keypair, paymentKey)
        })
        .catch((error) => {
          this.setState({
            registrationInProgress: false
          })
          this.updateAlert('danger', error)
        })
      }
    }
  }

  updateAlert(alertStatus, alertMessage) {
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage
      }]
    })
  }

  render() {
    const name = this.props.routeParams.name
    const availableNames = this.props.availability.names
    const nameAvailabilityObject = availableNames[name]
    const nameIsSubdomain = isSubdomain(name)
    const identityIndex = this.state.index
    let enoughMoney = false
    let price = 0
    if (nameAvailabilityObject) {
      price = nameAvailabilityObject.price
    }
    price = roundTo.up(price, 6) + PRICE_BUFFER
    const walletBalance = this.props.balances.total

    if (nameIsSubdomain || (walletBalance >= price)) {
      enoughMoney = true
    }

    const walletAddress = this.props.addresses[0]

    const registrationInProgress = this.state.registrationInProgress

    const acceptedWarning = this.state.acceptedWarning

    return (
      <div>
        {this.state.alerts.map((alert, index) =>
           (
          <Alert key={index} message={alert.message} status={alert.status} />
          )
        )}
        {enoughMoney ?
          <div>
          {nameIsSubdomain ?
            <div className="text-center">
              <h3 className="modal-heading">
                Are you sure you want to register <strong>{name}</strong>?
              </h3>
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
                  <Link
                    to={`/profiles/i/add-username/${identityIndex}/search`}
                    className="btn btn-tertiary btn-block"
                  >
                    Back
                  </Link>
                }
              </div>
            </div>
            :
            <div>
              {acceptedWarning ?
                <div>
                  <h3 className="modal-heading">
                    Enter your password to register <strong>{name}</strong>
                  </h3>
                  <div className="text-center">
                    <p>Requesting registration of <strong>{name} </strong>
                     will spend {price} bitcoins from your wallet.
                    </p>
                  </div>
                  <div>
                    <form onSubmit={this.register}>
                      <InputGroup
                        data={this.state}
                        onChange={this.onValueChange}
                        name="password"
                        label="Password"
                        placeholder="Password"
                        type="password"
                        required
                      />
                      <button
                        type="submit"
                        onClick={this.register}
                        className="btn btn-primary btn-block"
                        disabled={registrationInProgress}
                      >
                        {registrationInProgress ?
                          <span>Generating registration transactions...</span>
                          :
                          <span>Request Registration</span>
                        }
                      </button>
                    </form>
                    <br />
                    {registrationInProgress ?
                      null
                      :
                      <Link
                        to={`/profiles/i/add-username/${identityIndex}/search`}
                        className="btn btn-tertiary btn-block"
                      >
                        Back
                      </Link>
                    }
                  </div>
                </div>
              :
                <div>
                  <h3 className="modal-heading">
                    Hope nobody beats you to it!
                  </h3>
                  <div className="text-center">
                    <p>You’re about to create a registration
                      request for <strong>{name}</strong>.</p>

                    <p>A few things:</p>
                    <ul
                      style={{
                        marginLeft: '20px',
                        marginRight: '20px',
                        textAlign: 'left'
                      }}
                    >
                      <li>Requesting registration costs money even
                      if someone else beats you to it.</li>
                      <li>Registration fees don’t go to Blockstack PBC or anyone else.</li>
                    </ul>
                    <button
                      className="btn btn-primary btn-block"
                      onClick={() => { this.setState({ acceptedWarning: true }) }}
                    >
                    I understand
                    </button>
                    <Link
                      to={`/profiles/i/add-username/${identityIndex}/search`}
                      className="btn btn-tertiary btn-block"
                    >
                      Back
                    </Link>
                  </div>
                </div>
              }
            </div>
          }
          </div>
          :
          <div style={{ textAlign: 'center' }}>
            <h3 className="modal-heading">Buy {name}</h3>
            <p>Send at least {price} bitcoins to your wallet:<br />
              <strong>{walletAddress}</strong>
            </p>
            <div style={{ textAlign: 'center' }}>
              {walletAddress ?
                <QRCode
                  style={{ width: 256 }}
                  value={walletAddress}
                />
                :
                null
              }
              <div>
                <div className="progress m-t-20 m-b-20">
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
                <Link
                  to={`/profiles/i/add-username/${identityIndex}/search`}
                  className="btn btn-tertiary btn-block"
                >
                  Back
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
