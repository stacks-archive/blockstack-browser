import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Alert from '../components/Alert'
import { AccountActions } from '../account/store/account'
import { AvailabilityActions } from './store/availability'
import { IdentityActions } from './store/identity'
import { RegistrationActions } from './store/registration'
import { hasNameBeenPreordered, isABlockstackName } from '../utils/name-utils'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/AddUsernameSearchPage.js')

const STORAGE_URL = '/account/storage'

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    availability: state.profiles.availability
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    IdentityActions, AccountActions, RegistrationActions, AvailabilityActions), dispatch)
}

class AddUsernameSearchPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      alerts: [],
      username: '',
      storageConnected: this.props.api.dropboxAccessToken !== null,
      availableDomains: {
        id: {
          registerUrl: this.props.api.registerUrl,
          free: false
        },
        'blockstack.id': {
          registerUrl: this.props.api.registerUrl,
          free: true
        }
      }
    }
    this.onChange = this.onChange.bind(this)
    this.search = this.search.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
    this.displayPricingAndAvailabilityAlerts = this.displayPricingAndAvailabilityAlerts.bind(this)
    this.displayConnectStorageAlert = this.displayConnectStorageAlert.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    logger.trace('componentWillReceiveProps')
    // Clear alerts
    this.setState({
      alerts: []
    })

    const storageConnected = this.props.api.dropboxAccessToken !== null
    const availability = nextProps.availability

    if (!storageConnected) {
      this.displayConnectStorageAlert()
    } else {
      this.displayPricingAndAvailabilityAlerts(availability)
    }
  }

  onChange(event) {
    const username = event.target.value.toLowerCase().replace(/\W+/g, '')
    logger.debug(`onChange: ${username}`)
    this.setState({
      username
    })
  }

  search(event) {
    logger.trace('search')
    const username = this.state.useranme
    logger.debug(`search: user is searching for ${username}`)
    event.preventDefault()
    const availableDomainSuffixes = Object.keys(this.availableDomains)
    const testDomainName = `${username}.${availableDomainSuffixes[0]}`
    if (!isABlockstackName(testDomainName)) {
      this.updateAlert('danger', `${username} is notNot valid Blockstack name`)
      return
    }

  }

  updateAlert(alertStatus, alertMessage, url = null) {
    logger.trace(`updateAlert: alertStatus: ${alertStatus}, alertMessage ${alertMessage}`)
    this.setState({
      alerts: [{
        status: alertStatus,
        message: alertMessage,
        url
      }]
    })
  }

  displayPricingAndAvailabilityAlerts(availability) {
    let tld = this.state.tlds[this.state.type]
    const domainName = `${this.state.username}.${tld}`

    if(domainName === availability.lastNameEntered) {
      if(availability.names[domainName].error) {
        const error = availability.names[domainName].error
        console.error(error)
        this.updateAlert('danger', `There was a problem checking on price & availability of ${domainName}`)
      } else {
        if(availability.names[domainName].checkingAvailability)
          this.updateAlert('info', `Checking if ${domainName} available...`)
        else if(availability.names[domainName].available) {
          if(availability.names[domainName].checkingPrice) {
            this.updateAlert('info', `${domainName} is available! Checking price...`)
          } else {
            const price = availability.names[domainName].price
            if(price < this.props.coreWalletBalance) {
              const roundedUpPrice = roundTo.up(price, 3)
              this.updateAlert('info', `${domainName} costs ~${roundedUpPrice} btc to register.`)
            } else {
              const shortfall = price - this.props.coreWalletBalance
              this.updateAlert('danger', `Your wallet doesn't have enough money to buy ${domainName}. Please send at least ${shortfall} more bitcoin to your wallet.`, WALLET_URL)
            }
          }
        } else {
          this.updateAlert('danger', `${domainName} has already been registered.`)
        }
      }
    }
  }

  displayConnectStorageAlert() {
    this.updateAlert('danger', 'Please go to the Storage app and connect a storage provider.', STORAGE_URL)
  }

  render() {
    return (
      <div>
        <div className="container vertical-split-content">
          <div className="col-sm-2">
          </div>
          <div className="col-sm-8">
            <h3>Search for your username</h3>
            {
              this.state.alerts.map((alert, index) => {
                return (
                  <Alert
                    key={index} message={alert.message} status={alert.status} url={alert.url}
                  />
              )
              })
            }
            <p>
              Add a username to save your profile so you can interact with other
              people on the decentralized internet.
            </p>
            <form className="form-inline" onSubmit={this.search}>
              <input
                name="username"
                className="form-control"
                placeholder="Username"
                value={this.state.username}
                onChange={this.onChange}
                required
                disabled={!this.state.storageConnected}
              />
              <button
                type="submit"
                className="btn btn-blue"
                disabled={!this.state.storageConnected}
              >
                Search
              </button>
            </form>
            <div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUsernameSearchPage)
