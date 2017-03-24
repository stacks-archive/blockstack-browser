import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import RadioGroup from 'react-radio-group'

import InputGroup from '../components/InputGroup'
import SaveButton from '../components/SaveButton'
import { SettingsActions } from '../store/settings'

function mapStateToProps(state) {
  return {
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

class ApiSettingsPage extends Component {
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

    this.onValueChange = this.onValueChange.bind(this)
    this.updateApi = this.updateApi.bind(this)
    this.resetApi = this.resetApi.bind(this)
    this.registerProtocolHandler = this.registerProtocolHandler.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      api: nextProps.api
    })
  }

  onValueChange(event) {
    let api = this.state.api
    api[event.target.name] = event.target.value
    this.setState({ api: api })
  }


  updateApi() {
    const api = this.state.api
    this.props.updateApi(api)
  }

  resetApi() {
    this.props.resetApi()
  }



  registerProtocolHandler() {
    window.navigator.registerProtocolHandler(
      "web+blockstack",
      location.origin + "/auth?authRequest=%s",
      "Blockstack handler"
    )
  }

  render() {
    return (
      <div className="col-md-9">
        <div>
          <h4>Authentication</h4>

          <p>
            <button onClick={this.registerProtocolHandler}
              className="btn btn-sm btn-outline-primary">
              Allow App Logins
            </button>
          </p>

          <hr />

          <RadioGroup name="hostedDataLocation"
            selectedValue={this.state.api.hostedDataLocation}
            onChange={this.onHostedDataValueChange}>
            {Radio => (
              <div>
                <h4>Blockstack API Options</h4>

                { this.state.api.apiCustomizationEnabled === true ?
                  <div>
                    <InputGroup name="nameLookupUrl" label="Name Lookup URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="searchUrl" label="Search URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="registerUrl" label="Register URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="addressLookupUrl" label="Address Names URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="addressBalanceUrl" label="Address URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="utxoUrl" label="UTXO URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="broadcastTransactionUrl" label="Broadcast Transaction URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="networkFeeUrl" label="Network Fee URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="walletPaymentAddressUrl" label="Core node wallet payment address URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="coreWalletWithdrawUrl" label="Core node wallet withdraw URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="pendingQueuesUrl" label="Core node pending queues URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="bitcoinAddressUrl" label="Bitcoin Address URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="ethereumAddressUrl" label="Ethereum Address URL"
                      data={this.state.api} onChange={this.onValueChange} />
                    <InputGroup name="pgpKeyUrl" label="PGP Key URL"
                      data={this.state.api} onChange={this.onValueChange} />
                  </div>
                : null }

                <div className="form-group">
                  <SaveButton onSave={this.updateApi} />
                </div>
                <p>
                  <button onClick={this.resetApi} className="btn btn-outline-primary">
                    Reset API
                  </button>
                </p>
              </div>
            )}
          </RadioGroup>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApiSettingsPage)
