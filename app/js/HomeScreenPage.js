import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Navbar from './components/Navbar'
import { AppsActions } from './store/apps'
import { Box, Flex, Type } from 'blockstack-ui'
import { Hover } from 'react-powerplug'
import { Spinner } from '@components/ui/components/spinner'

const AppsSection = ({ title, apps, limit, category, ...rest }) => {
  let appsList = apps
  if (limit) {
    appsList = appsList.filter((app, i) => i <= limit - 1)
  }
  if (category) {
    appsList = appsList.filter(app => app.category === category)
  }
  return (
    <Box
      width={1}
      maxWidth={1100}
      mx="auto"
      p={4}
      mb={4}
      borderBottom="1px solid rgba(15,15,15,0.1)"
      {...rest}
    >
      <Box textAlign="center">
        <p className="app-section-heading">{title}</p>
      </Box>
      <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
        {appsList.map(app => (
          <AppIcon key={app.name} {...app} />
        ))}
      </Flex>
    </Box>
  )
}

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

const Image = props => (
  <Box
    is="img"
    borderRadius="15px"
    boxShadow="0px 0px 35px 0px rgba(0, 0, 0, 0.15)"
    bg="rgba(44, 150, 255, 0.15)"
    {...props}
  />
)

const AppIcon = ({ website, imgixImageUrl, name }) => {
  return (
    <Hover>
      {({ bind, hovered }) => (
        <Box
          maxWidth={[80, 100, 100]}
          width={[1 / 3, 1 / 4, 1 / 4, 1 / 4, 1 / 5]}
          p={2}
          m={[2, 3, 4, 4]}
          transition="0.15s all ease-in-out"
          transform={hovered ? 'translateY(-5px)' : 'none'}
          color="blue.dark"
          {...bind}
        >
          <Box
            maxWidth="100%"
            width="100%"
            display="block"
            is="a"
            href={website}
            target="_blank"
            style={{
              textDecoration: 'none',
              color: 'black !important',
              textOverflow: 'ellipsis'
            }}
          >
            <Image
              maxWidth="100%"
              width="100%"
              display="block"
              src={imgixImageUrl}
              alt={name}
              mb={3}
            />
            <Box textAlign="center">
              <Type
                is="h3"
                fontSize={[2]}
                lineHeight={1.45}
                color="black !important"
                style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '100%'
                }}
              >
                {name}
              </Type>
            </Box>
          </Box>
        </Box>
      )}
    </Hover>
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
    const loading = this.props.apps.loading && !this.props.apps.topApps.length
    return (
      <div>
        <Navbar hideBackToHomeLink activeTab="home" />
        <div className="home-screen">
          {loading ? (
            <Flex
              flexDirection="column"
              alignItems="center"
              width={1}
              justifyContent="center"
              p={4}
            >
              <Box width="48px" mx="auto">
                <Spinner color="black" size={48} />
              </Box>
              <Box py={4} textAlign="center">
                <Type fontWeight="500" fontSize={2} opacity={0.5}>
                  Fetching apps...
                </Type>
              </Box>
            </Flex>
          ) : (
            <Box maxWidth={1200} width="100%" mx="auto" p={[1, 2, 4]}>
              <AppsSection
                title="Top Ranked Apps"
                apps={this.props.apps.topApps}
                limit={15}
              />
              {this.props.apps.appsByCategory.map(category => (
                <AppsSection
                  title={category.label}
                  apps={category.apps}
                  limit={15}
                />
              ))}
            </Box>
          )}
        </div>
      </div>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreenPage)
