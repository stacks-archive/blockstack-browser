import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import RegistrationSearchBox from './RegistrationSearchBox'
import RegistrationSearchResults from './RegistrationSearchResults'

import { AccountActions } from '../../../account/store/account'
import { AvailabilityActions } from '../../store/availability'
import { IdentityActions } from '../../store/identity'
import { RegistrationActions } from '../../store/registration'
import { isABlockstackName } from '../../../utils/name-utils'

import log4js from 'log4js'

const logger = log4js.getLogger('profiles/components/registration/RegistrationSearchView.js')

const STORAGE_URL = '/account/storage'

function mapStateToProps(state) {
  return {
    api: state.settings.api,
    availability: state.profiles.availability,
    walletBalance: state.account.coreWallet.balance,
    balanceUrl: state.settings.api.zeroConfBalanceUrl,
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    identityAddresses: state.account.identityAccount.addresses
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({},
    IdentityActions, AccountActions, RegistrationActions, AvailabilityActions), dispatch)
}

class RegistrationSearchView extends Component {
  static propTypes = {
    api: PropTypes.object.isRequired,
    availability: PropTypes.object.isRequired,
    checkNameAvailabilityAndPrice: PropTypes.func.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    walletBalance: PropTypes.number.isRequired,
    routeParams: PropTypes.object.isRequired,
    balanceUrl: PropTypes.string.isRequired,
    localIdentities: PropTypes.array.isRequired,
    defaultIdentity: PropTypes.number.isRequired,
    identityAddresses: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    const availableDomains = Object.assign({},
      {
        id: {
          registerUrl: this.props.api.registerUrl
        }
      }) // ,
      // this.props.api.subdomains)
    const nameSuffixes = Object.keys(availableDomains)

    this.state = {
      alerts: [],
      username: '',
      searchingUsername: '',
      storageConnected: this.props.api.storageConnected,
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


  componentWillReceiveProps() {
    logger.trace('componentWillReceiveProps')
    // Clear alerts
    this.setState({
      alerts: []
    })

    if (this.props.localIdentities.map(x => x.usernamePending).includes(true)) {
      this.updateAlert(
        'danger', 'You have a pending name registration. Starting a new registration' +
          ' may interfere with that registration\'s transactions.')
    }

    const storageConnected = this.props.api.storageConnected

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

  onOnenameTransferClick = (event) => {
    event.preventDefault()
    event.stopPropagation()
    logger.trace('transferFromOnenameClick')
    const identityIndex = this.props.defaultIdentity
    const identity = this.props.localIdentities[identityIndex]
    const identityAddress = identity.ownerAddress

    const gaiaBucketAddress = this.props.identityAddresses[0]
    const profileUrl = `https://gaia.blockstack.org/hub/${gaiaBucketAddress}/${identityIndex}/profile.json`

    const url = `https://onename.com/settings?action=export&address=${identityAddress}&url=${profileUrl}`
    logger.debug(`transferFromOnenameClick: Redirecting to ${url}...`)
    const win = window.open(url, '_blank')
    win.focus()
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
    const index = parseInt(this.props.routeParams.index, 10)
    const showSearchResults = this.state.showSearchResults
    return (
      <div style={{ textAlign: 'center' }}>
        {!showSearchResults ?
          <RegistrationSearchBox
            alerts={this.state.alerts}
            search={this.search}
            username={this.state.username}
            onChange={this.onChange}
            onOnenameTransferClick={this.onOnenameTransferClick}
            disabled={!this.state.storageConnected}
          />
          :
          <RegistrationSearchResults
            showSearchBox={this.showSearchBox}
            searchingUsername={searchingUsername}
            nameSuffixes={this.state.nameSuffixes}
            availableNames={availableNames}
            index={index}
          />
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationSearchView)
