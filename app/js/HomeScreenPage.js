// @flow
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Navbar from './components/Navbar'
import { IdentityActions } from './profiles/store/identity'
import { AccountActions }  from './account/store/account'
import appList from './data/apps'

function mapStateToProps(state) {
  return {
    localIdentities: state.profiles.identity.localIdentities,
    defaultIdentity: state.profiles.identity.default,
    api: state.settings.api
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, IdentityActions, AccountActions), dispatch)
}

const AppIcon = (props) => {
  return (
    <div className="container-fluid app-box-wrap">
      <Link
        to={props.launchLink}
        className="app-box-container"
      >
        <div className="app-box">
          <img
            src={`/images/${props.iconImage}`}
            alt={props.displayName}
          />
        </div>
      </Link>
      <div className="app-text-container">
        <h3>{props.displayName}</h3>
      </div>
    </div>
  )
}

class HomeScreenPage extends Component {

  render() {
    return (
      <div>
        <Navbar
          hideBackToHomeLink
          activeTab="home"
        />
        <div className="home-screen">
          <div className="container-fluid app-center">
            <div className="container app-wrap">
              <div className="app-container no-padding">

                {appList.apps.map(app => {
                  return (
                    <AppIcon 
                      iconImage={app.appIcon.small} 
                      displayName={app.displayName} 
                      launchLink={app.launchLink} 
                    />
                  )
                })}

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenPage)
