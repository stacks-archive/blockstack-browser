import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Navbar from './components/Navbar'
import ToolTip from './components/ToolTip'
import { AppsActions } from './store/apps'
import appList from './data/apps'
import { isWebAppBuild, isCoreEndpointDisabled } from './utils/window-utils'

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

const AppIcon = (props) => {
  const disabledForCore = isCoreEndpointDisabled() && props.storageRequired
  return (
    <div className="container-fluid app-box-wrap">
      <ToolTip id="coreDisabled">
        <div>
          <div>
            This app requires Gaia storage, which is not supported in this build.
            Feature coming soon!
          </div>
        </div>
      </ToolTip>
      {disabledForCore ?
        <div
          className="app-box"
          data-tip
          data-for="coreDisabled"
        >
          <img
            src={`/images/${props.iconImage}`}
            alt={props.displayName}
          />
        </div>
      :
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
      }
      <div className="app-text-container">
        <h3>{props.displayName}</h3>
      </div>
    </div>
  )
}

const disclaimerWeb = `The Blockstack Tokens are a crypto asset that is currently being 
                  developed by Blockstack Token LLC, a Delaware limited liability 
                  company, whose website can be found at www.blockstack.com. The 
                  website you are currently visiting (browser.blockstack.org) is 
                  sponsored by Blockstack PBC, an affiliate of Blockstack Token LLC, 
                  and should not be viewed as an offer or sale of securities.`

const disclaimerApp = `The Blockstack Tokens are a crypto asset that is currently being 
                  developed by Blockstack Token LLC, a Delaware limited liability 
                  company, whose website can be found at www.blockstack.com. The 
                  application you are currently using (The Blockstack Browser) is 
                  sponsored by Blockstack PBC, an affiliate of Blockstack Token LLC, 
                  and should not be viewed as an offer or sale of securities.`


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
    if (this.props.appListLastUpdated === undefined
      || this.props.appListLastUpdated < (Date.now() - 43200000)) {
      this.props.refreshAppList(this.props.api.browserServerUrl, this.props.instanceIdentifier,
        this.props.instanceCreationDate)
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
            <div className="container app-wrap text-center">

              <div className="app-section m-b-45">
                <p className="app-section-heading">
                  User-ready Apps
                </p>
                <div className="app-container no-padding">
                  {appList.apps.map((app) => {
                    if (app.status === 'user_ready') {
                      return (<AppIcon
                        key={app.name}
                        iconImage={app.appIcon.small}
                        displayName={app.displayName}
                        launchLink={app.launchLink}
                        storageRequired={!!app.storageRequired}
                      />)
                    } else {
                      return null
                    } }
                  )}
                  <AppIcon
                    key="token-sale"
                    iconImage="app-icon-token-sale.png"
                    displayName="Token Sale"
                    launchLink="https://blockstack.com/"
                    storageRequired={false}
                  />
                </div>
              </div>

              <div className="app-section m-b-45">
                <p className="app-section-heading">
                  Token Portfolio Apps
                </p>
                <div className="app-container no-padding">
                  {appList.apps.map((app) => {
                    if (app.status === 'user_ready_token') {
                      return (<AppIcon
                        key={app.name}
                        iconImage={app.appIcon.small}
                        displayName={app.displayName}
                        launchLink={app.launchLink}
                        storageRequired={!!app.storageRequired}
                      />)
                    } else {
                      return null
                    } }
                  )}
                </div>
              </div>

              <div className="app-section m-b-45">
                <p className="app-section-heading">
                  Apps-in-progress
                </p>
                <div className="app-container no-padding">
                  {appList.apps.map((app) => {
                    if (app.status === 'in_progress') {
                      return (<AppIcon
                        key={app.name}
                        iconImage={app.appIcon.small}
                        displayName={app.displayName}
                        launchLink={app.launchLink}
                        storageRequired={!!app.storageRequired}
                      />)
                    } else {
                      return null
                    } }
                  )}
                </div>
              </div>

              <div className="m-t-70">
                <p className="small text-muted">
                  {isWebAppBuild() ? disclaimerWeb : disclaimerApp}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenPage)
