import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'

function mapStateToProps(state) {
  return {
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

class DashboardPage extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
    <div className="dashboard">
      <div className="container-fluid app-center">
        <div className="container app-wrap">
          <div className="app-container no-padding">
            <div className="app-box-wrap">
              <Link to="/profiles" className="app-box-container">
                <div className="app-box">
                  <img src="/images/app-icon-profiles@2x.png" />
                </div>
              </Link>
              <div className="app-text-container">
                <h3>Profiles</h3>
              </div>
            </div>
            <div className="app-box-wrap">
              <Link to="/storage/providers" className="app-box-container">
                <div className="app-box">
                  <img src="/images/app-icon-storage-light@2x.png" />
                </div>
              </Link>
              <div className="app-text-container">
                <h3>Storage</h3>
              </div>
            </div>
            <div className="app-box-wrap">
              <Link to="/wallet/receive" className="app-box-container">
                <div className="app-box">
                  <img src="/images/app-icon-wallet-card-flat@2x.png" />
                </div>
              </Link>
              <div className="app-text-container">
                <h3>Wallet</h3>
              </div>
            </div>
            <div className="app-box-wrap">
              <Link to="/account/password" className="app-box-container">
                <div className="app-box">
                  <img src="/images/app-icon-settings@2x.png" />
                </div>
              </Link>
              <div className="app-text-container">
                <h3>Account</h3>
              </div>
            </div>
            <div className="app-box-wrap">
              <a href="https://helloblockstack.com"
                 className="app-box-container">
                <div className="app-box">
                  <img src="/images/app-icon-hello-blockstack@2x.png" />
                </div>
              </a>
              <div className="app-text-container">
                <h3>Hello, Blockstack</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
