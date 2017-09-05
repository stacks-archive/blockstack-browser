// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Alert from '../components/Alert'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from './store/identity'
import { findAddressIndex } from '../utils'
import AdvancedSidebar from './components/AdvancedSidebar'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/TransferNamePage.js')

type Props = {
  coreAPIPassword: string,
  routeParams: Object,
  bar?: string,
  identityAddresses: Array<string>,
  identityKeypairs: Object,
  localIdentities: Object,
  namesOwned: Array<string>,
  nameTransfers: Array<mixed>,
  broadcastNameTransfer: Function,
  nameTransferUrl: string
}

type State = {
  agreed: boolean,
  alerts: Array<{ status: string, message: string}>,
  clickedBroadcast: boolean,
  disabled: boolean,
  newOwner: string
}

function mapStateToProps(state) {
  return {
    coreAPIPassword: state.settings.api.coreAPIPassword,
    identityAddresses: state.account.identityAccount.addresses,
    identityKeypairs: state.account.identityAccount.keypairs,
    localIdentities: state.profiles.identity.localIdentities,
    namesOwned: state.profiles.identity.namesOwned,
    nameTransfers: state.profiles.identity.nameTransfers,
    nameTransferUrl: state.settings.api.nameTransferUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions, IdentityActions), dispatch)
}

class TransferNamePage extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      agreed: false,
      alerts: [],
      clickedBroadcast: false,
      disabled: false,
      newOwner: ''
    }

    this.onToggle = this.onToggle.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.displayAlerts = this.displayAlerts.bind(this)
    this.transferName = this.transferName.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
  }

  componentWillMount() {
    logger.trace('componentWillMount')
  }

  componentWillReceiveProps() {
    logger.trace('componentWillReceiveProps')
  }

  onToggle: Function
  onToggle(event) {
    this.setState({
      [event.target.name]: event.target.checked
    })
  }

  onValueChange: Function
  onValueChange(event) {
    event.persist()
    console.log(event.target)
    this.setState(() => ({
      [event.target.name]: event.target.value
    }))
  }

  props: Props

  displayAlerts: Function
  displayAlerts(props) {
    const name = props.routeParams.index
    const transferState = props.nameTransfers[name]
    if (transferState && this.state.clickedBroadcast) {
      if (transferState.error) {
        this.updateAlert('danger', transferState.error)
        this.setState({
          disabled: false
        })
      } else if (transferState.broadcasting) {
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

  updateAlert: Function
  updateAlert(alertStatus, alertMessage) {
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{ status: alertStatus, message: alertMessage }]
    })
  }

  transferName: Function
  transferName(event) {
    logger.trace('transferName')
    event.preventDefault()
    this.setState(() => ({
      clickedBroadcast: true,
      disabled: true
    }))

    const name = this.props.routeParams.index
    const ownerAddress = this.props.localIdentities[name].ownerAddress
    const addressIndex = findAddressIndex(ownerAddress, this.props.identityAddresses)
    const newOwner = this.state.newOwner
    const keypair = this.props.identityKeypairs[addressIndex]
    const coreAPIPassword = this.props.coreAPIPassword
    logger.debug(`transferName: using key with index ${addressIndex}`)
    this.props.broadcastNameTransfer(this.props.nameTransferUrl,
      coreAPIPassword, name, keypair, newOwner)
  }

  render() {
    const agreed = this.state.agreed
    const name = this.props.routeParams.index
    const newOwner = this.state.newOwner
    return (
      <div className="card-list-container profile-content-wrapper">
        <div>
          <div className="vertical-split-content">
            <div className="row">
              <div className="col-md-3 sidebar-list">
                <AdvancedSidebar activeTab="transfer-name" name={name} />
              </div>
              <div className="col-md-7">
                <Link to={`/profiles/${name}/local`}>&lt; Back </Link>
                <h1 className="h1-modern">
                  Transfer ownership of {name}
                </h1>
                {
                  this.state.alerts.map((alert, index) => (
                    <Alert key={index} message={alert.message} status={alert.status} />
                    ))
                }
                <p>
                Transfer ownership is an advanced feature. It requires broadcasting a
                transaction on Bitcoin network and costs Bitcoin.
                </p>
                <form
                  className="form-check"
                  onSubmit={this.transferName}
                  disabled={this.state.disabled}
                >
                  <input
                    type="text"
                    className="form-control"
                    name="newOwner"
                    value={newOwner}
                    onChange={this.onValueChange}
                    required
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
                      &nbsp;I understand this could result in the loss of my
                      Blockstack name and will cost me money.
                    </label>
                  </fieldset>

                  <button
                    className="btn btn-sm btn-primary"
                    type="submit"
                    disabled={!agreed || this.state.disabled}
                  >
                    Broadcast transfer
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

export default connect(mapStateToProps, mapDispatchToProps)(TransferNamePage)
