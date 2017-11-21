import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Alert from '../components/Alert'
import InputGroup from '../components/InputGroup'

import { AccountActions } from '../account/store/account'
import { IdentityActions } from './store/identity'
import { decryptBitcoinPrivateKey } from '../utils'


import log4js from 'log4js'

const logger = log4js.getLogger('profiles/ZoneFilePage.js')

function mapStateToProps(state) {
  return {
    nameLookupUrl: state.settings.api.nameLookupUrl,
    identityAddresses: state.account.identityAccount.addresses,
    identityKeypairs: state.account.identityAccount.keypairs,
    localIdentities: state.profiles.identity.localIdentities,
    zoneFileUrl: state.settings.api.zoneFileUrl,
    publicIdentities: state.profiles.identity.publicIdentities,
    coreAPIPassword: state.settings.api.coreAPIPassword,
    zoneFileUpdates: state.profiles.identity.zoneFileUpdates,
    encryptedBackupPhrase: state.account.encryptedBackupPhrase
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions, IdentityActions), dispatch)
}

class ZoneFilePage extends Component {
  static propTypes = {
    publicIdentities: PropTypes.object.isRequired,
    identityAddresses: PropTypes.array.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    localIdentities: PropTypes.array.isRequired,
    nameLookupUrl: PropTypes.string.isRequired,
    fetchPublicIdentity: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired,
    zoneFileUrl: PropTypes.string.isRequired,
    coreAPIPassword: PropTypes.string.isRequired,
    broadcastZoneFileUpdate: PropTypes.func.isRequired,
    zoneFileUpdates: PropTypes.object.isRequired,
    encryptedBackupPhrase: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    const identityIndex = props.routeParams.index
    const currentLocalIdentity = props.localIdentities[identityIndex]
    const username = currentLocalIdentity.username
    const currentPublicIdentity = props.publicIdentities[username]
    let zoneFile = null
    if (currentPublicIdentity) {
      zoneFile = currentPublicIdentity.zoneFile
    }

    this.state = {
      currentLocalIdentity,
      currentPublicIdentity,
      username,
      zoneFile,
      agreed: false,
      alerts: [],
      clickedBroadcast: false,
      disabled: false,
      edited: false,
      password: ''
    }
    this.onToggle = this.onToggle.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.displayAlerts = this.displayAlerts.bind(this)
    this.reset = this.reset.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
    this.updateZoneFile = this.updateZoneFile.bind(this)
  }

  componentWillMount() {
    logger.trace('componentWillMount')
    this.props.fetchPublicIdentity(
      this.props.nameLookupUrl,
      this.state.username
    )
    this.displayAlerts(this.props)
  }

  componentWillReceiveProps(nextProps) {
    logger.trace('componentWillReceiveProps')
    const currentPublicIdentity = nextProps.publicIdentities[this.state.username]
    this.setState({
      currentPublicIdentity
    })
    if (currentPublicIdentity) {
      const zoneFile = currentPublicIdentity.zoneFile
      if (zoneFile && !nextProps.edited) {
        this.setState({
          zoneFile
        })
      } else {
        logger.error('componentWillReceiveProps: no zone file!')
      }
    }
    this.displayAlerts(nextProps)
  }

  onToggle(event) {
    this.setState({
      [event.target.name]: event.target.checked
    })
  }

  onValueChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
      edited: true
    })
  }

  displayAlerts(props) {
    const identityIndex = props.routeParams.index
    const updateState = props.zoneFileUpdates[identityIndex]
    if (updateState && this.state.clickedBroadcast) {
      if (updateState.error) {
        this.updateAlert('danger', updateState.error)
        this.setState({
          disabled: false
        })
      } else if (updateState.broadcasting) {
        this.updateAlert('success', 'Broadcasting zone file update transaction...')
      } else {
        this.updateAlert('success', 'Broadcasted zone file update transaction.')
        this.setState({
          disabled: false
        })
      }
    } else {
      this.setState({
        alerts: []
      })
    }
  }

  reset(event) {
    logger.trace('reset')
    event.preventDefault()

    let zoneFile = null
    if (this.state.currentPublicIdentity) {
      zoneFile = this.state.currentPublicIdentity.zoneFile
    }
    this.setState({
      clickedBroadcast: false,
      zoneFile,
      edited: false,
      alerts: [],
      password: ''
    })
  }

  updateAlert(alertStatus, alertMessage) {
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  updateZoneFile(event) {
    logger.trace('updateZoneFile')
    event.preventDefault()
    this.setState({
      clickedBroadcast: true,
      disabled: true,
      edited: true
    })
    const username = this.state.username
    const identityIndex = this.props.routeParams.index
    const keypair = this.props.identityKeypairs[identityIndex]
    const password = this.state.password
    const encryptedBackupPhrase = this.props.encryptedBackupPhrase
    logger.debug(`updateZoneFile: using key with index ${identityIndex}`)
    decryptBitcoinPrivateKey(password, encryptedBackupPhrase)
    .then((paymentKey) => {
      this.props.broadcastZoneFileUpdate(this.props.zoneFileUrl,
      this.props.coreAPIPassword, username, keypair, this.state.zoneFile, paymentKey)
    })
  }

  render() {
    const agreed = this.state.agreed
    const zoneFile = this.state.zoneFile
    const username = this.state.username
    return (
      <div className="card-list-container profile-content-wrapper">
        {username ?
          <div>
            <div className="vertical-split-content">
              <div className="row">
                <div className="col-md-7">
                  <Link
                    to="/profiles/i/all"
                    className="btn btn-outline-dark btn-pill btn-sm default"
                  >&lt; Back </Link>
                  <h1 className="h1-modern">
                    Update {username} zone file
                  </h1>
                  {
                    this.state.alerts.map((alert, index) =>
                       (
                      <Alert key={index} message={alert.message} status={alert.status} />
                      )
                    )
                  }
                  <p>
                  Updating your zone file is an advanced feature that can break
                  your Blockstack name and profile. It requires broadcasting a
                  transaction on Bitcoin network and costs Bitcoin.
                  </p>
                  <form
                    className="form-check"
                    onSubmit={this.updateZoneFile}
                    disabled={this.state.disabled}
                  >
                    <textarea
                      className="form-control"
                      name="zoneFile"
                      value={zoneFile}
                      onChange={this.onValueChange}
                      required
                      rows={5}
                      disabled={this.state.disabled}
                    />
                    <InputGroup
                      data={this.state}
                      onChange={this.onValueChange}
                      name="password"
                      label="Password"
                      placeholder="Password"
                      type="password"
                      required
                    />
                    <fieldset>
                      <label
                        className="form-check-label"
                        style={{
                          fontSize: 'inherit',
                          marginBottom: '1em',
                          marginTop: '1em',
                          textTransform: 'none'
                        }}
                      >
                        <input
                          name="agreed"
                          checked={agreed}
                          onChange={this.onToggle}
                          type="checkbox"
                        />
                        &nbsp;I understand this could break my Blockstack
                        name and will cost me money.
                      </label>
                    </fieldset>

                    <button
                      className="btn btn-sm btn-primary"
                      type="submit"
                      disabled={!agreed || this.state.disabled}
                    >
                      Broadcast update
                    </button>
                    <button
                      className="btn btn-sm btn-tertiary"
                      onClick={this.reset}
                      disabled={this.state.disabled}
                      title="Reset your edits to the current zone file."
                    >
                      Reset
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        :
          <div>
            <h3>You need to have a username to update your zone file.</h3>
          </div>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ZoneFilePage)
