import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AddUsernameSearchBox from './AddUsernameSearchBox'

import { AccountActions } from '../account/store/account'
import { AvailabilityActions } from './store/availability'
import { IdentityActions } from './store/identity'
import { RegistrationActions } from './store/registration'
import { isABlockstackName } from '../utils/name-utils'
import roundTo from 'round-to'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/AddUsernameSearchPage.js')

const STORAGE_URL = '/account/storage'

const nameResultStyle = {
  marginBottom: '3em'
}

const availabilityHeaderStyle = {
  marginTop: '1em',
  marginBottom: '0.5em'
}
function mapStateToProps(state) {
  return {
    api: state.settings.api,
    availability: state.profiles.availability,
    walletBalance: state.account.coreWallet.balance,
    balanceUrl: state.settings.api.zeroConfBalanceUrl
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    IdentityActions, AccountActions, RegistrationActions, AvailabilityActions), dispatch)
}

class AddUsernameSearchPage extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired,
    checkNameAvailabilityAndPrice: PropTypes.func.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    walletBalance: PropTypes.number.isRequired,
    routeParams: PropTypes.object.isRequired,
    balanceUrl: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props)
    const availableDomains = Object.assign({},
      {
        id: {
          registerUrl: this.props.api.registerUrl
        }
      },
      this.props.api.subdomains)

    const nameSuffixes = Object.keys(availableDomains)

    this.state = {
      alerts: [],
      username: '',
      searchingUsername: '',
      storageConnected: this.props.api.dropboxAccessToken !== null,
      availableDomains,
      nameSuffixes,
      showSearchResults: false
    }
    this.onChange = this.onChange.bind(this)
    this.search = this.search.bind(this)
    this.updateAlert = this.updateAlert.bind(this)
    this.displayConnectStorageAlert = this.displayConnectStorageAlert.bind(this)
    this.showSearchBox = this.showSearchBox.bind(this)
  }

  componentDidMount() {
    logger.trace('componentDidMount')
    this.props.refreshCoreWalletBalance(this.props.balanceUrl,
      this.props.api.coreAPIPassword)
  }


  componentWillReceiveProps(nextProps) {
    logger.trace('componentWillReceiveProps')
    // Clear alerts
    this.setState({
      alerts: []
    })

    const storageConnected = this.props.api.dropboxAccessToken !== null

    if (!storageConnected) {
      this.displayConnectStorageAlert()
    }
  }

  onChange(event) {
    const username = event.target.value.toLowerCase().replace(/\W+/g, '')
    this.setState({
      username
    })
  }

  search(event) {
    logger.trace('search')
    const username = this.state.username
    logger.debug(`search: user is searching for ${username}`)
    event.preventDefault()
    const nameSuffixes = this.state.nameSuffixes
    const testDomainName = `${username}.${nameSuffixes[0]}`
    if (!isABlockstackName(testDomainName)) {
      this.updateAlert('danger', `${testDomainName} is not a valid Blockstack name`)
      return
    }
    this.setState({
      searchingUsername: username,
      showSearchResults: true
    })

    nameSuffixes.forEach((nameSuffix) =>
    this.props.checkNameAvailabilityAndPrice(this.props.api,
      `${username}.${nameSuffix}`))
  }

  showSearchBox(event) {
    logger.trace('showSearchBox')
    event.preventDefault()
    this.setState({
      username: '',
      searchingUsername: '',
      showSearchResults: false
    })
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

  displayConnectStorageAlert() {
    this.updateAlert('danger', 'Please go to the Storage app and connect a storage provider.',
    STORAGE_URL)
  }

  render() {
    const searchingUsername = this.state.searchingUsername
    const availableNames = this.props.availability.names
    const ownerAddress = this.props.routeParams.index
    const showSearchResults = this.state.showSearchResults
    return (
      <div style={{ textAlign: 'center' }}>
        {!showSearchResults ?
          <AddUsernameSearchBox
            alerts={this.state.alerts}
            search={this.search}
            username={this.state.username}
            onChange={this.onChange}
            disabled={!this.state.storageConnected}
          />
          :
          <div>
            <a
              href=""
              className="pull-left"
              onClick={this.showSearchBox}
            >
              &lt; Back
            </a>
            <br />
            <h3 className="modal-heading">Available names</h3>
            <div className="modal-body">
              {searchingUsername ?
                this.state.nameSuffixes.map((nameSuffix) => {
                  const name = `${searchingUsername}.${nameSuffix}`
                  const nameAvailabilityObject = availableNames[name]
                  const searching = !nameAvailabilityObject ||
                  nameAvailabilityObject.checkingAvailability
                  const isSubdomain = nameSuffix.split('.').length > 1

                  const available = nameAvailabilityObject &&
                    nameAvailabilityObject.available
                  const checkingPrice = nameAvailabilityObject &&
                    nameAvailabilityObject.checkingPrice
                  let price = 0
                  if (nameAvailabilityObject) {
                    price = nameAvailabilityObject.price
                  }
                  price = roundTo.up(price, 6)
                  return (
                    <div key={nameSuffix}>
                    {searching ?
                      <h4>Checking {name}...</h4>
                      :
                      <div>
                        {available ?
                          <div style={nameResultStyle}>
                            <h4 style={availabilityHeaderStyle}>{name}</h4>
                            {isSubdomain ?
                              <Link
                                className="btn btn-primary btn-sm"
                                to={`/profiles/i/add-username/${ownerAddress}/select/${name}`}
                              >
                                Get <strong>{name}</strong> for free
                              </Link>
                            :
                              <div>
                              {checkingPrice ?
                                <div className="progress">
                                  <div
                                    className="progress-bar progress-bar-striped progress-bar-animated"
                                    role="progressbar"
                                    aria-valuenow="100"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    style={{ width: '100%' }}
                                  >
                                  Checking price...
                                  </div>
                                </div>
                                :
                                <Link
                                  className="btn btn-primary btn-sm"
                                  to={`/profiles/i/add-username/${ownerAddress}/select/${name}`}
                                >
                                  Buy <strong>{name}</strong> for {price} bitcoins
                                </Link>
                              }
                              </div>
                            }
                          </div>
                          :
                          <div>
                            <h4 style={availabilityHeaderStyle}>{name}</h4>
                            <button
                              className="btn btn-primary btn-sm"
                              disabled
                            >
                              {name} is already taken
                            </button>
                          </div>

                        }
                      </div>
                    }
                    </div>
                  )
                })
                :
                null
              }
            </div>
          </div>
        }
        <Link
          to="/profiles"
          className="btn btn-secondary btn-sm"
        >
          Cancel
        </Link>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUsernameSearchPage)
