import PropTypes from 'prop-types'
import React, { Component } from 'react'
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
    instanceIdentifier: state.apps.instanceIdentifier,
    instanceCreationDate: state.apps.instanceCreationDate
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, AppsActions), dispatch)
}

const AppIcon = ({ launchLink, iconImage, displayName }) => {
  /* eslint-disable */
  const image = require(`../images/${iconImage}`)
  /* eslint-enable */
  return (
    <div className="container-fluid app-box-wrap">
      <a href={launchLink} target="_blank" className="app-box-container">
        <div className="app-box">
          <picture>
            <img src={image} alt={displayName} />
          </picture>
        </div>
      </a>
      <div className="app-text-container">
        <h3>{displayName}</h3>
      </div>
    </div>
  )
}

AppIcon.propTypes = {
  launchLink: PropTypes.string.isRequired,
  iconImage: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  storageRequired: PropTypes.bool.isRequired
}

class HomeScreenPage extends Component {
  static propTypes = {
    apps: PropTypes.object.isRequired,
    refreshAppList: PropTypes.func.isRequired,
    appListLastUpdated: PropTypes.number,
    api: PropTypes.object.isRequired,
    instanceIdentifier: PropTypes.string,
    instanceCreationDate: PropTypes.number
  }

  componentWillMount() {
    // Refresh apps list every 12 hours
    if (
      this.props.appListLastUpdated === undefined ||
      this.props.appListLastUpdated < Date.now() - 43200000
    ) {
      this.props.refreshAppList(
        this.props.api.browserServerUrl,
        this.props.instanceIdentifier,
        this.props.instanceCreationDate
      )
    }
  }

  render() {
    const appSections = [{
      title: 'User-ready Apps',
      key: 'user_ready'
    }, {
      title: 'Chat Apps',
      key: 'user_ready_chat'
    }, {
      title: 'Wallet Apps',
      key: 'user_ready_wallet'
    }, {
      title: 'Token Portfolio Apps',
      key: 'user_ready_token'
    }, {
      title: 'Apps-in-progress',
      key: 'in_progress'
    }]

    return (
      <div>
        <Navbar hideBackToHomeLink activeTab="home" />
        <div className="home-screen">
          <div className="container-fluid app-center">
            <div className="container app-wrap text-center">
              {appSections.map((section) => (
                <div className="app-section m-b-45" key={section.key}>
                  <p className="app-section-heading">{section.title}</p>
                  <div className="app-container no-padding">
                    {appList.apps
                      .filter(app => app.status === section.key)
                      .map(app => (
                        <AppIcon
                          key={app.name}
                          iconImage={app.appIcon.small}
                          displayName={app.displayName}
                          launchLink={app.launchLink}
                          storageRequired={!!app.storageRequired}
                        />
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenPage)
