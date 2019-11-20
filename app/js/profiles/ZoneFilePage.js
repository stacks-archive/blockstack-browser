import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Alert from '@components/Alert'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from './store/identity'
import { findAddressIndex } from '@utils'
import AdvancedSidebar from './components/AdvancedSidebar'
import SecondaryNavBar from '@components/SecondaryNavBar'

import log4js from 'log4js'

const logger = log4js.getLogger(__filename)

function mapStateToProps(state) {
  return {
    nameLookupUrl: state.settings.api.nameLookupUrl,
    identityAddresses: state.account.identityAccount.addresses,
    identityKeypairs: state.account.identityAccount.keypairs,
    localIdentities: state.profiles.identity.localIdentities,
    zoneFileUrl: state.settings.api.zoneFileUrl,
    coreAPIPassword: state.settings.api.coreAPIPassword,
    zoneFileUpdates: state.profiles.identity.zoneFileUpdates
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign({}, AccountActions, IdentityActions),
    dispatch
  )
}

class ZoneFilePage extends Component {
  static propTypes = {
    identityAddresses: PropTypes.array.isRequired,
    identityKeypairs: PropTypes.array.isRequired,
    localIdentities: PropTypes.array.isRequired,
    nameLookupUrl: PropTypes.string.isRequired,
    routeParams: PropTypes.object.isRequired,
    zoneFileUrl: PropTypes.string.isRequired,
    coreAPIPassword: PropTypes.string.isRequired,
    broadcastZoneFileUpdate: PropTypes.func.isRequired,
    zoneFileUpdates: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    const name = this.props.routeParams.index
    const zoneFile = this.props.localIdentities[name].zoneFile

    this.state = {
      zoneFile,
      agreed: false,
      alerts: [],
      clickedBroadcast: false,
      disabled: false,
      edited: false
    }
    this.onToggle = this.onToggle.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.displayAlerts = this.displayAlerts.bind(this)
    this.reset = this.reset.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
    this.updateZoneFile = this.updateZoneFile.bind(this)
  }

  componentWillMount() {
    logger.info('componentWillMount')
    this.displayAlerts(this.props)
  }

  componentWillReceiveProps(nextProps) {
    logger.info('componentWillReceiveProps')
    const name = this.props.routeParams.index
    const zoneFile = this.props.localIdentities[name].zoneFile
    if (zoneFile && !nextProps.edited) {
      this.setState({
        zoneFile
      })
    } else {
      logger.error('componentWillReceiveProps: no zone file!')
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
    const name = props.routeParams.index
    const updateState = props.zoneFileUpdates[name]
    if (updateState && this.state.clickedBroadcast) {
      if (updateState.error) {
        this.updateAlert('danger', updateState.error)
        this.setState({
          disabled: false
        })
      } else if (updateState.broadcasting) {
        this.updateAlert(
          'success',
          'Broadcasting zone file update transaction...'
        )
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
    logger.info('reset')
    event.preventDefault()
    const name = this.props.routeParams.index
    const zoneFile = this.props.localIdentities[name].zoneFile
    this.setState({
      clickedBroadcast: false,
      zoneFile,
      edited: false,
      alerts: []
    })
  }

  updateAlert(alertStatus, alertMessage) {
    logger.info(
      `updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`
    )
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  updateZoneFile(event) {
    logger.info('updateZoneFile')
    event.preventDefault()
    this.setState({
      clickedBroadcast: true,
      disabled: true,
      edited: true
    })
    const name = this.props.routeParams.index
    const ownerAddress = this.props.localIdentities[name].ownerAddress
    const addressIndex = findAddressIndex(
      ownerAddress,
      this.props.identityAddresses
    )
    const keypair = this.props.identityKeypairs[addressIndex]
    logger.debug(`updateZoneFile: using key with index ${addressIndex}`)
    this.props.broadcastZoneFileUpdate(
      this.props.zoneFileUrl,
      this.props.coreAPIPassword,
      name,
      keypair,
      this.state.zoneFile
    )
  }

  render() {
    const agreed = this.state.agreed
    const zoneFile = this.state.zoneFile
    const name = this.props.routeParams.index
    const username = this.props.localIdentities[name].username
    return (
      <div className="card-list-container profile-content-wrapper">
        <div>
          <div className="vertical-split-content">
            <div className="row">
              <div className="col-md-3 sidebar-list">
                <AdvancedSidebar activeTab="zone-file" name={name} />
              </div>
              <div className="col-md-7">
                <SecondaryNavBar
                  leftButtonTitle="Back"
                  leftButtonLink="/profiles/i/all"
                />
                <h1 className="h1-modern">Update {username} zone file</h1>
                {this.state.alerts.map((alert, index) => (
                  <Alert
                    key={index}
                    message={alert.message}
                    status={alert.status}
                  />
                ))}
                <p>
                  Transferring the ownership of a name is an advanced
                  feature. Ownership transfer requires modifying a name's
                  zone file and broadcasting an update transaction with this
                  change on the Bitcoin network. Further, transfers can fail
                  and leave your name in a state where you can no longer use
                  it. You must pay for the transaction costs in Bitcoin
                  (BTC) regardless of whether the transaction succeeds or
                  fails.
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
                      Yes, I understand I am requesting an ownership
                      transfer of name {username}. Further, I understand that
                      the transfer can fail leaving my name unavailable.
                      Regardless of whether the owner transfer transaction
                      fails or succeeds, I am required to pay transaction
                      fees in Bitcoin (BTC).
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
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ZoneFilePage)
