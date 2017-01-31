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
  static propTypes = {
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="container-fluid">
      <div className="container profile-wrap-wide">
        <section>
          <div className="container-fluid no-padding">
            <div className="col-sm-12 app-container no-padding">
              <div className="col-sm-4">
                <Link to="/identity" className="app-box-container">
                  <div className="app-box container-fluid">
                    <img src="/images/app-identity.png" />
                  </div>
                </Link>
                <div className="app-text-container">
                  <h3>Profiles</h3>
                </div>
              </div>
              <div className="col-sm-4">
                <Link to="/account/settings" className="app-box-container">
                  <div className="app-box">
                    <img src="/images/app-settings.png" />
                  </div>
                </Link>
                <div className="app-text-container">
                  <h3>Settings</h3>
                </div>
              </div>
              <div className="col-sm-4">
                <a href="http://localhost:5000/"
                  className="app-box-container" target="_blank">
                  <div className="app-box">
                    <img src="/images/app-hello-blockstack.png" />
                  </div>
                </a>
                <div className="app-text-container">
                  <h3>Hello, Blockstack</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)