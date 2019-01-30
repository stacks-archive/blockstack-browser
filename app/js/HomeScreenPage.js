import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Navbar from './components/Navbar'
import { AppsActions } from './store/apps'
import { Box, Flex, Type } from 'blockstack-ui'
import { Hover } from 'react-powerplug'
import { Spinner } from '@components/ui/components/spinner'

const Loading = ({ ...rest }) => (
  <Flex
    flexDirection="column"
    alignItems="center"
    width={1}
    justifyContent="center"
    p={4}
    {...rest}
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
)

const Content = ({ topApps, allApps, ...rest }) => (
  <Box maxWidth={1200} width="100%" mx="auto" p={[1, 2, 4]} {...rest}>
    <AppsSection title="Top Ranked Apps" apps={topApps} limit={15} />
    {allApps.map(category => (
      <AppsSection title={category.label} apps={category.apps} limit={15} />
    ))}
  </Box>
)

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
          <AppItem
            key={app.name}
            name={app.name}
            imgixImageUrl={app.imgixImageUrl}
            website={app.website}
          />
        ))}
      </Flex>
    </Box>
  )
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

const AppItem = ({ website, imgixImageUrl, name }) => {
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

const HomeScreenPage = props => {
  const loading = props.apps && props.apps.loading && !props.apps.topApps.length
  return (
    <Box>
      <Navbar hideBackToHomeLink activeTab="home" />
      <Box className="home-screen">
        {loading ? (
          <Loading />
        ) : (
          <Content
            allApps={props.apps.appsByCategory}
            topApps={props.apps.topApps}
          />
        )}
      </Box>
    </Box>
  )
}

Content.propTypes = {
  topApps: PropTypes.array.isRequired,
  allApps: PropTypes.array.isRequired
}

AppsSection.propTypes = {
  title: PropTypes.string.isRequired,
  apps: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired
}
AppItem.propTypes = {
  website: PropTypes.string.isRequired,
  imgixImageUrl: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
}

HomeScreenPage.propTypes = {
  apps: PropTypes.object.isRequired,
  refreshAppList: PropTypes.func.isRequired,
  doFetchApps: PropTypes.func.isRequired,
  appListLastUpdated: PropTypes.number,
  api: PropTypes.object.isRequired,
  instanceIdentifier: PropTypes.string,
  instanceCreationDate: PropTypes.number
}

const mapStateToProps = state => ({
  apps: state.apps,
  appListLastUpdated: state.apps.lastUpdated,
  api: state.settings.api,
  instanceIdentifier: state.apps.instanceIdentifier,
  instanceCreationDate: state.apps.instanceCreationDate
})

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...AppsActions }, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeScreenPage)
