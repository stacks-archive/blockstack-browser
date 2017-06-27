import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Image from './../components/Image'
import { AccountActions } from '../account/store/account'
import Completion from './Completion'
import ActionItem from './ActionItem'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import roundTo from 'round-to'

function mapStateToProps(state) {
  return {
    dropboxAccessToken: state.settings.api.dropboxAccessToken,
    localIdentities: state.profiles.identity.localIdentities,
    addressBalanceUrl: state.settings.api.balanceUrl,
    coreWalletAddress: state.account.coreWallet.address,
    coreWalletBalance: state.account.coreWallet.balance,
    coreAPIPassword: state.settings.api.coreAPIPassword,
    nextIdentityAddressIndex: state.account.identityAccount.addressIndex,
    loggedIntoApp: state.auth.loggedIntoApp,
    viewedRecoveryCode: state.account.viewedRecoveryCode
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

class StatusBar extends Component {
  static propTypes = {
    hideBackToHomeLink: PropTypes.bool,
    dropboxAccessToken: PropTypes.string,
    localIdentities: PropTypes.object.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    coreWalletBalance: PropTypes.number,
    coreWalletAddress: PropTypes.string,
    coreAPIPassword: PropTypes.string,
    addressBalanceUrl: PropTypes.string,
    nextIdentityAddressIndex: PropTypes.number.isRequired,
    loggedIntoApp: PropTypes.bool.isRequired,
    viewedRecoveryCode: PropTypes.bool
  }

  constructor(props) {
    super(props)
    this.storageProviderConnected = this.storageProviderConnected.bind(this)
    this.profileCreated = this.profileCreated.bind(this)
    this.depositedBitcoin = this.depositedBitcoin.bind(this)
    this.signedIntoFirstApp = this.signedIntoFirstApp.bind(this)
    this.wroteDownRecoveryCode = this.wroteDownRecoveryCode.bind(this)
    this.registeredUsername = this.registeredUsername.bind(this)
    this.roundedBtcBalance = this.roundedBtcBalance.bind(this)
    this.numberOfActionItems = this.numberOfActionItems.bind(this)
  }

  componentDidMount() {
    if (this.props.coreWalletAddress !== null) {
      this.props.refreshCoreWalletBalance(this.props.addressBalanceUrl,
            this.props.coreAPIPassword)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.coreWalletAddress !== nextProps.coreWalletAddress) {
      this.props.refreshCoreWalletBalance(nextProps.addressBalanceUrl,
        this.props.coreAPIPassword)
    }
  }

  storageProviderConnected() {
    return this.props.dropboxAccessToken ? true : false
  }

  profileCreated() {
    return this.props.nextIdentityAddressIndex > 0
  }

  depositedBitcoin() {
    return this.props.coreWalletBalance > 0
  }

  signedIntoFirstApp() {
    return this.props.loggedIntoApp
  }

  wroteDownRecoveryCode() {
    return this.props.viewedRecoveryCode
  }

  registeredUsername() {
    const localIdentities = this.props.localIdentities
    const localIdentitiesKeys = Object.keys(localIdentities)
    for (let i = 0; i < localIdentitiesKeys.length; i++) {
      const key = localIdentitiesKeys[i]
      if (localIdentities[key].ownerAddress !== key) {
        return true
      }
    }
    return false
  }

  roundedBtcBalance() {
    const btcBalance = this.props.coreWalletBalance
    if (btcBalance === null) {
      return 0
    } else {
      const roundedAmount = roundTo(btcBalance, 3)
      return roundedAmount
    }
  }

  numberOfActionItems() {
    let count = 0

    if (!this.storageProviderConnected()) {
      count = count + 1
    }

    if (!this.profileCreated()) {
      count = count + 1
    }

    if (!this.depositedBitcoin()) {
      count = count + 1
    }

    if (!this.signedIntoFirstApp()) {
      count = count + 1
    }

    if (!this.wroteDownRecoveryCode()) {
      count = count + 1
    }

    if (!this.registeredUsername()) {
      count = count + 1
    }

    return count
  }

  render() {
    const popover = (
      <Popover id="things-to-do">
        <ActionItem
          action="Connect a storage provider to regain control of your data"
          destinationUrl="/storage/providers"
          destinationName="Storage"
          completed={this.storageProviderConnected()}
        />
        <ActionItem
          action="Create your first profile independent of 3rd parties"
          destinationUrl="/profiles"
          destinationName="Profiles"
          completed={this.profileCreated()}
        />
        <ActionItem
          action="Sign in to your first Blockstack app"
          destinationUrl="https://helloblockstack.com"
          destinationName="Apps"
          completed={this.signedIntoFirstApp()}
        />
        <ActionItem
          action="Write down your backup code for keychain recovery"
          destinationUrl="/account/backup"
          destinationName="Backup"
          completed={this.wroteDownRecoveryCode()}
        />
        <ActionItem
          action="Deposit Bitcoin to enable username registration"
          destinationUrl="/wallet/receive"
          destinationName="Wallet"
          completed={this.depositedBitcoin()}
        />
        <ActionItem
          action="Register a username for your profile"
          destinationUrl="/profiles"
          destinationName="Profiles"
          completed={this.registeredUsername()}
        />
      </Popover>
    )

    const numberOfActionItems = this.numberOfActionItems()

    return (
      <div className="status-bar status-bar-transparent-dark">
      {this.props.hideBackToHomeLink ?
        null
      :
        <Link to="/" className="status-bar-back">
          <i className="fa fa-angle-left status-bar-icon"></i>
          Home Screen
        </Link>
      }
        <div className="pull-right">
          <div className="status-inline status-completion">
            <div className="status-complete-wrap">
            {numberOfActionItems > 0 ?
              <OverlayTrigger trigger={['click']} placement="bottom" overlay={popover}>
                <div className="status-complete-dot">
                  <div
                  className="status-complete-object img-circle"
                  style={{ cursor: 'default' }}>
                  {numberOfActionItems}
                  </div>
                </div>
              </OverlayTrigger>
              :
              null
            }
            </div>
          </div>
          <div className="status-inline status-balance">
            <p>Balance {this.roundedBtcBalance()} BTC</p>
          </div>
          <div className="status-inline status-profile">
            <Image className="status-profile-img img-circle" src="/images/avatar.png" />
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)
