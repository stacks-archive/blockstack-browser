import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from './store/identity'
import { RegistrationActions } from './store/registration'
import { findAddressIndex, decryptBitcoinPrivateKey } from '@utils'
import InputGroup from '@components/InputGroup'

import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

function mapStateToProps(state) {
  return {
    identityAddresses: state.account.identityAccount.addresses,
    api: state.settings.api,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase,
    identityKeypairs: state.account.identityAccount.keypairs,
    localIdentities: state.profiles.identity.localIdentities,
    currentIdentity: state.profiles.identity.current,
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
    localIdentities: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      error: null,
      success: null,
      renewInProgress: false,
    }
    this.onValueChange = this.onValueChange.bind(this)
    this.renew = this.renew.bind(this)
  }

  // componentWillMount() {
  //   logger.info('componentWillMount')
  // }

  // componentWillReceiveProps(nextProps) {
  //   logger.info('componentWillReceiveProps')
  //   this.displayAlerts(nextProps)
  // }

  onValueChange = event =>
    this.setState({
      [event.target.name]: event.target.value
    })

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

    const paymentKey = await decryptBitcoinPrivateKey(
      password,
      encryptedBackupPhrase
    )

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
          error: error.toString()
        })
      })
  }

  render() {
    const identityIndex = this.props.routeParams.index
    const localIdentities = this.props.localIdentities
    const currentIdentity = localIdentities[identityIndex]
    const { renewInProgress } = this.state

    return (
      <div className="container-fluid p-0">

          <div className="row">
            <div className="col-md-12">
              <h3>Enter your password to renew {currentIdentity.username}</h3>
            </div>
            <div className="col-md-12">
              <form onSubmit={this.renew}>
                <InputGroup
                  data={this.state}
                  onChange={this.onValueChange}
                  name="password"
                  label=""
                  placeholder="Password"
                  type="password"
                  required
                />
                {this.state.error ? <div className="alert alert-danger">{this.state.error}</div> : null}
                {this.state.success ? <div className="alert alert-success">{this.state.success}</div> : null}
                <button
                  type="submit"
                  onClick={this.renew}
                  className="btn btn-primary btn-block"
                  disabled={renewInProgress}
                >
                  {renewInProgress ? (
                    <span>Generating renew transaction...</span>
                  ) : (
                    <span>Renew</span>
                  )}
                </button>
              </form>
            </div>
          </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RenewNamePage)
