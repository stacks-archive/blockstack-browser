// @flow
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Alert from '../components/Alert'
import { AccountActions } from '../account/store/account'
import { IdentityActions } from './store/identity'
import { findAddressIndex,
authorizationHeaderValue } from '../utils'


import log4js from 'log4js'

const logger = log4js.getLogger('profiles/TransferNamePage.js')

type Props = {
  coreAPIPassword: string,
  routeParams: Object,
  bar?: string,
  identityAddresses: Array<string>,
  identityKeypairs: Object,
  localIdentities: Object,
  namesOwned: Array<string>
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
    namesOwned: state.profiles.identity.namesOwned
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
    logger.debug(`updateZoneFile: using key with index ${addressIndex}`)

    const url = `http://localhost:6270/v1/names/${name}/owner`
    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorizationHeaderValue(coreAPIPassword)
    }

    // Core registers with an uncompressed address,
    // browser expects compressed addresses,
    // we need to add a suffix to indicate to core
    // that it should use a compressed addresses
    // see https://en.bitcoin.it/wiki/Wallet_import_format
    // and https://github.com/blockstack/blockstack-browser/issues/607
    const compressedPublicKeySuffix = '01'
    const coreFormatOwnerKey = `${keypair.key}${compressedPublicKeySuffix}`
    const ownerKey = coreFormatOwnerKey
    const requestBody = JSON.stringify({
      owner_key: ownerKey,
      owner: newOwner
    })
    fetch(url,
      {
        method: 'PUT',
        headers: requestHeaders,
        body: requestBody
      })
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
