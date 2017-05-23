import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Image from './../components/Image'
import { AccountActions } from '../account/store/account'
import Completion from './Completion'
import ActionItem from './ActionItem'
import { Popover, OverlayTrigger } from 'react-bootstrap'

function mapStateToProps(state) {
  return {
    dropboxAccessToken: state.settings.api.dropboxAccessToken,
    localIdentities: state.profiles.identity.localIdentities,
    addressBalanceUrl: state.settings.api.addressBalanceUrl,
    coreWalletAddress: state.account.coreWallet.address,
    coreWalletBalance: state.account.coreWallet.balance,
    coreAPIPassword: state.settings.api.coreAPIPassword
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AccountActions), dispatch)
}

const popover = (
  <Popover>
    <ActionItem
      action="Connect a storage provider to regain control of your data"
      destinationUrl="/storage/providers"
      destinationName="Storage"
      completed={false}
    />
    <ActionItem
      action="Create your first profile independent of 3rd parties"
      destinationUrl="/profiles"
      destinationName="Profiles"
      completed={false}
    />
    <ActionItem
      action="Sign in to your first Blockstack app"
      destinationUrl="https://helloblockstack.com"
      destinationName="Apps"
      completed={false}
    />
    <ActionItem
      action="Write down your backup code for keychain recovery"
      destinationUrl="/account/backup"
      destinationName="Backup"
      completed={false}
    />
    <ActionItem
      action="Deposit Bitcoin to enable username registration"
      destinationUrl="/wallet/receive"
      destinationName="Wallet"
      completed={false}
    />
    <ActionItem
      action="Register a username for your profile"
      destinationUrl="/wallet/receive"
      destinationName="Wallet"
      completed={false}
    />
  </Popover>
)

class StatusBar extends Component {
  static propTypes = {
    hideBackToHomeLink: PropTypes.bool,
    dropboxAccessToken: PropTypes.string.isRequired,
    localIdentities: PropTypes.array.isRequired,
    refreshCoreWalletBalance: PropTypes.func.isRequired,
    coreWalletBalance: PropTypes.number,
    coreWalletAddress: PropTypes.string,
    refreshBtcPrice: PropTypes.func.isRequired,
    coreAPIPassword: PropTypes.string,
    addressBalanceUrl: PropTypes.string
  }

  constructor(props) {
    super(props)
    this.storageProviderConnected = this.storageProviderConnected.bind(this)
    this.profileCreated = this.profileCreated.bind(this)
    this.depositedBitcoin = this.depositedBitcoin.bind(this)
    this.signedIntoFirstApp = this.signedIntoFirstApp.bind(this)
    this.wroteDownRecoveryCode = this.wroteDownRecoveryCode.bind(this)
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
    return this.props.localIdentities.length > 0
  }

  depositedBitcoin() {
    return this.props.coreWalletBalance > 0
  }

  signedIntoFirstApp() {

  }

  wroteDownRecoveryCode() {

  }

  render() {
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
              <OverlayTrigger trigger={['click']} placement="bottom" overlay={popover}>
                <div className="status-complete-dot">
                  <div className="status-complete-object img-circle" style={{ cursor: 'default' }}>6</div>
                </div>
              </OverlayTrigger>
            </div>
          </div>
          <div className="status-inline status-balance">
            <p>Balance 0.0009233 BTC</p>
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
