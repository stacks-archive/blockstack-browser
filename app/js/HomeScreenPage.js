import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Navbar from './components/Navbar'
import { AppsActions } from './store/apps'
import appList from './data/apps'

function mapStateToProps(state) {
  return {
    apps: state.apps,
    appListLastUpdated: state.apps.lastUpdated,
    api: state.settings.api,
    instanceIdentifier: state.apps.instanceIdentifier
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AppsActions), dispatch)
}

const AppIcon = (props) => (
  <div className="container-fluid app-box-wrap">
    <a
      href={props.launchLink}
      className="app-box-container"
    >
      <div className="app-box">
        <img
          src={`/images/${props.iconImage}`}
          alt={props.displayName}
        />
      </div>
    </a>
    <div className="app-text-container">
      <h3>{props.displayName}</h3>
    </div>
  </div>
)

AppIcon.propTypes = {
  launchLink: PropTypes.string.isRequired,
  iconImage: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired
}

class HomeScreenPage extends Component {

  static propTypes = {
    apps: PropTypes.object.isRequired,
    refreshAppList: PropTypes.func.isRequired,
    appListLastUpdated: PropTypes.number,
    api: PropTypes.object.isRequired,
    instanceIdentifier: PropTypes.string
  }

  componentWillMount() {
    // Refresh apps list every 12 hours
    if (this.props.appListLastUpdated < (Date.now() - 43200000)) {
      this.props.refreshAppList(this.props.api.browserServerUrl, this.props.instanceIdentifier)
    }
  }

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

                {appList.apps.map((app) => (
                  <AppIcon 
                    key={app.name}
                    iconImage={app.appIcon.small} 
                    displayName={app.displayName} 
                    launchLink={app.launchLink} 
                  />
                ))}

              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenPage)
