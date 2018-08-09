import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import InputGroup from '@components/InputGroup'
import SaveButton from '@components/SaveButton'
import { SettingsActions } from './store/settings'
import log4js from 'log4js'

const logger = log4js.getLogger('account/ApiSettingsPage.js')

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

export class ApiSettingsPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    updateApi: PropTypes.func.isRequired,
    resetApi: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      api: this.props.api
    }
  }

  componentWillReceiveProps(nextProps) {
    logger.trace('componentWillReceiveProps')
    this.setState({
      api: nextProps.api
    })
  }

  onValueChange = (event) => {
    logger.trace('onValueChange')
    const api = { ...this.state.api }
    const newValue = event.target.value
    const key = event.target.name
    logger.debug(`onValueChange: key: ${key} newValue: ${newValue}`)
    api[key] = newValue
    this.setState({ api })
  }

  onCheckboxChange = (event) => {
    this.setState({
      api: {
        ...this.state.api,
        [event.target.name]: event.target.checked
      }
    })
  }

  updateApi = () => {
    logger.trace('updateApi')
    const api = this.state.api
    this.props.updateApi(api)
  }

  resetApi = () => {
    logger.trace('resetApi')
    this.props.resetApi(this.props.api)
  }

  registerProtocolHandler() {
    window.navigator.registerProtocolHandler(
      'web+blockstack',
      `${location.origin}/auth?authRequest=%s`,
      'Blockstack handler'
    )
  }

  render() {
    return (
      <div className="m-b-100">
        <h3 className="m-t-10" style={{ paddingLeft: '15px' }}>
          Blockstack API Options
        </h3>

        {this.state.api.apiCustomizationEnabled === true ? (
          <div>
            <InputGroup
              name="coreAPIPassword"
              label="Blockstack Core API Password"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="logServerPort"
              label="localhost Logging Port"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="gaiaHubUrl"
              label="URL for Gaia Hub Connection"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="nameLookupUrl"
              label="Name Lookup URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="searchUrl"
              label="Search URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="registerUrl"
              label="Register URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="bitcoinAddressLookupUrl"
              label="Address Names URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="zeroConfBalanceUrl"
              label="Address URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="insightUrl"
              label="Insight API URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="broadcastUrl"
              label="Broadcast Transaction URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="networkFeeUrl"
              label="Network Fee URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="walletPaymentAddressUrl"
              label="Core node wallet payment address URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="coreWalletWithdrawUrl"
              label="Core node wallet withdraw URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="pendingQueuesUrl"
              label="Core node pending queues URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="bitcoinAddressUrl"
              label="Bitcoin Address URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="ethereumAddressUrl"
              label="Ethereum Address URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="pgpKeyUrl"
              label="PGP Key URL"
              data={this.state.api}
              onChange={this.onValueChange}
            />
            <InputGroup
              name="btcPriceUrl"
              label="BTCUSD price URL"
              data={this.state.api}
              onChange={this.onValueChange}
              onReturnKeyPress={this.resetApi}
            />
            <div className="form-group form-check m-b-11">
              <label className="form-check-label">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="hasDisabledEventTracking"
                  checked={this.state.api.hasDisabledEventTracking}
                  onChange={this.onCheckboxChange}
                />
                Disable anonymous analytics
              </label>
            </div>
          </div>
        ) : null}

        <div className="form-group">
          <SaveButton onSave={this.updateApi} />
        </div>
        <p>
          <button onClick={this.resetApi} className="btn btn-outline-primary">
            Reset API
          </button>
        </p>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiSettingsPage)
