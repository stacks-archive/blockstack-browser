import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { AccountActions } from '../../../account/store/account'
import { AvailabilityActions } from '../../store/availability'
import { IdentityActions } from '../../store/identity'
import { RegistrationActions } from '../../store/registration'
import { hasNameBeenPreordered, isSubdomain } from '@utils/name-utils'
import { decryptBitcoinPrivateKey } from '@utils'
import roundTo from 'round-to'
import { QRCode } from 'react-qr-svg'
import Alert from '@components/Alert'
import InputGroup from '@components/InputGroup'
import log4js from 'log4js'
import { Box, Flex } from 'blockstack-ui'

const logger = log4js.getLogger(__filename)
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
    btcBalanceUrl: state.settings.api.btcBalanceUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign(
      {},
      IdentityActions,
      AccountActions,
      RegistrationActions,
      AvailabilityActions
    ),
    dispatch
  )
}

const RegisterButton = ({ onClick, disabled, ...rest }) => (
  <Box {...rest}>
    <Box
      is="button"
      className="btn btn-primary btn-block"
      disabled={disabled}
      onClick={onClick}
    >
      {disabled ? <span>Registering...</span> : <span>Register</span>}
    </Box>
  </Box>
)

const CloseButton = ({ ...rest }) => (
  <Box {...rest}>
    <Link to={`/profiles`} className="btn btn-primary btn-block">
      <span>Close</span>
    </Link>
  </Box>
)

const SubdomainContent = ({
  name,
  loading,
  identityIndex,
  doRegister,
  ...rest
}) => (
  <Box textAlign="center" {...rest}>
    <Box pb={2}>
      <Box lineHeight="1.5" is="h3">
        Are you sure you want to register <strong>{name}</strong>?
      </Box>
    </Box>

    <Box>
      <p>
        <strong>{name}</strong> is a free username.
      </p>
    </Box>

    <Box>
      <RegisterButton pb={2} onClick={doRegister} disabled={loading} />
      {!loading ? (
        <Box>
          <Link
            to={`/profiles/i/add-username/${identityIndex}/search`}
            className="btn btn-tertiary btn-block"
          >
            Back
          </Link>
        </Box>
      ) : null}
    </Box>
  </Box>
)

const ErrorState = ({ message, ...rest }) => (
  <Box textAlign="center">
    <Box pb={4}>
      <Box m={0} p={0} is="h3">
        Something went wrong!
      </Box>
    </Box>
    {message && (
      <Box fontSize="16px" lineHeight="1.5">
        {message}
      </Box>
    )}
    <Box pt={4}>
      <CloseButton />
    </Box>
  </Box>
)

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
    btcBalanceUrl: PropTypes.string.isRequired,
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

    const nameHasBeenPreordered = hasNameBeenPreordered(
      name,
      props.localIdentities
    )
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

    if (nameIsSubdomain || walletBalance >= price) {
      enoughMoney = true
    }

    const that = this
    if (!enoughMoney) {
      this.paymentTimer = setInterval(() => {
        logger.debug('paymentTimer: calling refreshBalances...')
        that.props.refreshBalances(
          that.props.btcBalanceUrl,
          that.props.addresses
        )
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
  }

  componentDidMount() {
    logger.info('componentDidMount')
    this.props.refreshBalances(this.props.btcBalanceUrl, this.props.addresses)

    // Only consider top level domains for showing the alert
    if (!isSubdomain(this.props.routeParams.name)) {
      const hasPendingReg = this.props.localIdentities
        .filter(ident => ident.usernamePending)
        .reduce((prev, ident) => prev || !isSubdomain(ident.username), false)
      if (hasPendingReg) {
        this.updateAlert(
          'danger',
          'You have a pending name registration. ' +
            'Starting a new registration may interfere with that ' +
            'registration’s transactions.'
        )
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const registration = nextProps.registration
    const name = nextProps.routeParams.name
    const index = nextProps.routeParams.index

    if (
      this.state.registrationInProgress &&
      registration.registrationSubmitted
    ) {
      logger.debug(
        'componentWillReceiveProps: registration submitted! redirecting...'
      )
      this.props.router.push(
        `/profiles/i/add-username/${index}/submitted/${name}`
      )
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

    if (nameIsSubdomain || walletBalance >= price) {
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

  onValueChange = event =>
    this.setState({
      [event.target.name]: event.target.value
    })

  register = async event => {
    logger.info('register')
    if (event) {
      event.preventDefault()
    }
    this.setState({
      registrationInProgress: true
    })
    const {
      localIdentities,
      routeParams,
      identityAddresses,
      identityKeypairs,
      registerName,
      api
    } = this.props

    const { index, name } = routeParams
    const address = identityAddresses[index]
    const identity = localIdentities[index]
    const { ownerAddress } = identity
    const nameHasBeenPreordered = hasNameBeenPreordered(name, localIdentities)
    const keypair = identityKeypairs[index]
    const nameTokens = name.split('.')
    const nameSuffix = name.split(nameTokens[0])
    const nameIsSubdomain = isSubdomain(name)

    if (nameHasBeenPreordered) {
      logger.error(`register: Name ${name} has already been preordered`)
      return
    }
    // has not been preordered

    logger.debug(`register: Will try to register ${name} for identity ${index}`)
    if (ownerAddress !== address) {
      this.setState({
        registrationInProgress: false
      })
      logger.error(
        `register: ${address} @ ${index} doesn't match owner ${ownerAddress}`
      )
      this.updateAlert('danger', 'There is a problem with your account.')
      return
    }

    logger.debug(`register: ${name} has name suffix ${nameSuffix}`)
    logger.debug(`register: is ${name} a subdomain? ${nameIsSubdomain}`)

    if (nameIsSubdomain) {
      registerName(api, name, identity, index, address, keypair)
    } else {
      const { password } = this.state
      const { encryptedBackupPhrase } = this.props
      try {
        const paymentKey = await decryptBitcoinPrivateKey(
          password,
          encryptedBackupPhrase
        )
        registerName(api, name, identity, index, address, keypair, paymentKey)
      } catch (error) {
        this.setState({
          registrationInProgress: false
        })
        this.updateAlert('danger', error.message)
      }
    }
  }

  updateAlert = (alertStatus, alertMessage) =>
    this.setState({
      alerts: [
        {
          status: alertStatus,
          message: alertMessage
        }
      ]
    })

  render() {
    const {
      routeParams,
      availability,
      balances,
      addresses,
      registration
    } = this.props

    const {
      index: identityIndex,
      registrationInProgress,
      acceptedWarning
    } = this.state

    const { name } = routeParams
    const { names: availableNames } = availability
    const nameAvailabilityObject = availableNames[name]
    const nameIsSubdomain = isSubdomain(name)
    const { total: walletBalance } = balances
    const [walletAddress] = addresses

    let price = 0
    if (nameAvailabilityObject) {
      price = nameAvailabilityObject.price
    }
    price = roundTo.up(price, 6) + PRICE_BUFFER

    const enoughMoney = nameIsSubdomain || walletBalance >= price

    return registration.error ? (
      <ErrorState message={registration.error} />
    ) : (
      <Box>
        {this.state.alerts.map((alert, index) => (
          <Alert key={index} message={alert.message} status={alert.status} />
        ))}
        {enoughMoney ? (
          <Box>
            {nameIsSubdomain ? (
              <SubdomainContent
                loading={registrationInProgress}
                name={name}
                identityIndex={identityIndex}
                doRegister={e => this.register(e)}
              />
            ) : (
              <div>
                {acceptedWarning ? (
                  <div>
                    <h3 className="modal-heading">
                      Enter your password to register <strong>{name}</strong>
                    </h3>
                    <div className="text-center">
                      <p>
                        Requesting registration of <strong>{name} </strong>
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
                          {registrationInProgress ? (
                            <span>Generating registration transactions...</span>
                          ) : (
                            <span>Request Registration</span>
                          )}
                        </button>
                      </form>
                      <br />
                      {registrationInProgress ? null : (
                        <Link
                          to={`/profiles/i/add-username/${identityIndex}/search`}
                          className="btn btn-tertiary btn-block"
                        >
                          Back
                        </Link>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="modal-heading">
                      Name Registration Disclaimer
                    </h3>
                    <div className="text-center">
                      <p>
                        You’re about to create a registration request for{' '}
                        <strong>{name}</strong>
                      </p>

                      <p>Please confirm you understand the following:</p>
                      <ul
                        style={{
                          marginLeft: '20px',
                          marginRight: '20px',
                          textAlign: 'left'
                        }}
                      >
                        <li>
                          Registrations are a race & there's a small chance
                          someone else will win.
                        </li>
                        <li>
                          Registration requests have a fee regardless of the
                          outcome.
                        </li>
                        <li>
                          Fees are destroyed on the network and not sent to any
                          company.
                        </li>
                      </ul>
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => {
                          this.setState({ acceptedWarning: true })
                        }}
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
                )}
              </div>
            )}
          </Box>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <h3 className="modal-heading">Buy {name}</h3>
            <p>
              Send at least {price} bitcoins to your wallet:
              <br />
              <strong>{walletAddress}</strong>
            </p>
            <div style={{ textAlign: 'center' }}>
              {walletAddress ? (
                <QRCode style={{ width: 256 }} value={walletAddress} />
              ) : null}
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
        )}
      </Box>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddUsernameSelectPage)
