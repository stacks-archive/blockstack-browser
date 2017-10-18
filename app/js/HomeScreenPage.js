// @flow
import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import Navbar from './components/Navbar'
import { AppsActions } from './store/apps'
import appList from './data/apps'

function mapStateToProps(state) {
  return {
    apps: state.apps
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AppsActions), dispatch)
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

  static propTypes = {
    apps: PropTypes.object.isRequired,
    refreshAppList: PropTypes.func.isRequired
  }

  componentWillMount() {
    // this.props.refreshAppList()
  }

  render() {
    console.log(this.props.apps)
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
                      key={app.name}
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
