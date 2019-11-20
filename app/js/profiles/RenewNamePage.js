import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { config, ecPairToAddress, hexStringToECPair, transactions } from 'blockstack'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from './store/identity'
import { RegistrationActions } from './store/registration'
import { decryptBitcoinPrivateKey, satoshisToBtc } from '../utils'
import InputGroup from '@components/InputGroup'

function mapStateToProps(state) {
  return {
    identityAddresses: state.account.identityAccount.addresses,
    api: state.settings.api,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    identityKeypairs: state.account.identityAccount.keypairs,
    localIdentities: state.profiles.identity.localIdentities,
    currentIdentity: state.profiles.identity.current
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, 
      AccountActions, 
      IdentityActions, 
      RegistrationActions
    ), dispatch
  )
}

class RenewNamePage extends Component {
  static propTypes = {
    currentIdentity: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    localIdentities: PropTypes.object.isRequired,
    routeParams: PropTypes.object.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired,
    renewDomain: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      error: null,
      success: null,
      renewInProgress: false,
      estimateInProgress: false,
      estimate: null
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.renew = this.renew.bind(this)
    this.estimateRenewal = this.estimateRenewal.bind(this)
  }

  onValueChange = event =>
    this.setState({
      [event.target.name]: event.target.value
    })

  estimateRenewal = async (evt) => {
    evt.preventDefault()
    this.setState({ estimateInProgress: true })
    const { network } = config
    const { password } = this.state
    const { encryptedBackupPhrase } = this.props
    const identityIndex = this.props.routeParams.index
    const localIdentities = this.props.localIdentities
    const currentIdentity = localIdentities[identityIndex]
    const { ownerAddress, username } = currentIdentity

    let paymentKey = null
    try {
      paymentKey = await decryptBitcoinPrivateKey(
        password,
        encryptedBackupPhrase
      )
    } catch (error) {
      this.setState({
        error: 'Invalid password'
      })
      return
    }

    const compressedPaymentKey = `${paymentKey}01`

    const paymentKeyPair = hexStringToECPair(compressedPaymentKey)
    const paymentAddress = network.coerceAddress(ecPairToAddress(paymentKeyPair))

    const ownerUTXOsPromise = network.getUTXOs(ownerAddress)
    const paymentUTXOsPromise = network.getUTXOs(paymentAddress)
    const [ownerUTXOs, paymentUTXOs] = await Promise.all([ownerUTXOsPromise, paymentUTXOsPromise])
    console.log(ownerUTXOs)

    const numOwnerUTXOs = ownerUTXOs.length
    const numPaymentUTXOs = paymentUTXOs.length
    const estimate = await transactions.estimateRenewal(
      username, network.coerceAddress(ownerAddress),
      network.coerceAddress(ownerAddress),
      network.coerceAddress(paymentAddress), true,
      numOwnerUTXOs + numPaymentUTXOs - 1)

    this.setState({ estimate, estimateInProgress: false })
  }

  renew = async event => {
    event.preventDefault()
    this.setState({
      error: null,
      renewInProgress: true
    })

    const identityIndex = this.props.routeParams.index
    const localIdentities = this.props.localIdentities
    const currentIdentity = localIdentities[identityIndex]
    const { ownerAddress, username, zoneFile } = currentIdentity
    const keyPairs = this.props.identityKeypairs
    const ownerKey = keyPairs[identityIndex].key
    
    const { password } = this.state
    const { encryptedBackupPhrase } = this.props

    let paymentKey = null
    try {
      paymentKey = await decryptBitcoinPrivateKey(
        password,
        encryptedBackupPhrase
      ) 
    } catch (error) {
      this.setState({
        error: 'Invalid password'
      })
      return
    }

    this.props.renewDomain(username, ownerKey, ownerAddress, paymentKey, zoneFile, false)
      .then(txhash => {
        this.setState({
          error: null,
          success: `Renew transaction hash: ${txhash}`,
          renewInProgress: false
        })
      })
      .catch(error => {
        this.setState({
          error: error.toString(),
          renewalInProgress: false
        })
      })
  }

  buttonText() {
    const { success, estimate, renewInProgress, estimateInProgress } = this.state
    if (success) {
      return 'Renewal Completed'
    }
    if (renewInProgress) {
      return 'Generating renewal transaction...'
    }
    if (estimate) {
      return 'Renew'
    }
    if (estimateInProgress) {
      return 'Generating estimated cost'
    }
    return 'Generate estimated price'
  }

  render() {
    const identityIndex = this.props.routeParams.index
    const localIdentities = this.props.localIdentities
    const currentIdentity = localIdentities[identityIndex]
    const { renewInProgress, estimate, success, estimateInProgress } = this.state

    return (
      <div className="container-fluid p-0">
        <div className="row">
          <div className="col-md-12">
            <h3>Enter your password to renew {currentIdentity.username}</h3>
          </div>
          <div className="col-md-12">
            <form onSubmit={estimate ? this.renew : this.estimateRenewal}>
              <InputGroup
                data={this.state}
                onChange={this.onValueChange}
                name="password"
                label=""
                placeholder="Password"
                type="password"
                required
              />
              {this.state.error ? (
                <div className="alert alert-danger">{this.state.error}</div>
              ) : null}
              {success && (
                <div className="alert alert-success">
                  <p>{success}</p>
                  <p style={{ marginBottom: 0 }}>
                    Processing your renewal can take up to two hours.
                  </p>
                </div>
              )}
              {estimate && !success ? (
                <div className="alert alert-success">
                  Renewing your name will cost roughly{' '}
                  {satoshisToBtc(estimate)} BTC.
                </div>
              ) : null}
              <button
                type="submit"
                onClick={estimate ? this.renew : this.estimateRenewal}
                className="btn btn-primary btn-block"
                disabled={
                  renewInProgress || !!success || estimateInProgress
                }
              >
                <span>{this.buttonText()}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RenewNamePage)
