import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Navbar } from '@components/nav-bar'
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
  <Box maxWidth={1250} width="100%" mx="auto" p={[1, 2, 4]} {...rest}>
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
    <Box width={1} mx="auto" p={[2, 4]} mb={4} {...rest}>
      <Flex
        borderBottom="1px solid"
        borderColor="blue.mid"
        mb={4}
        pb={3}
        mx={2}
        alignItems="flex-end"
        justifyContent="space-between"
      >
        <Type fontSize={3}>{title}</Type>
        <Type>See All</Type>
      </Flex>
      <Flex justifyContent="center" alignItems="center" flexWrap="wrap">
        {appsList.map(app => (
          <AppItem
            key={app.name}
            name={app.name}
            imgixImageUrl={app.imgixImageUrl}
            website={app.website}
            app={app}
          />
        ))}
      </Flex>
    </Box>
  )
}

const Image = props => (
  <Box is="img" borderRadius="15px" bg="rgba(44, 150, 255, 0.15)" {...props} />
)

const AppItem = ({ website, imgixImageUrl, name, app }) => {
  const descMaxLength = 55
  let desc = app.description.trim()

  if (app.description[app.description.length - 1] !== '.') {
    desc += '.'
  }

  if (app.description.length > descMaxLength) {
    desc = <>{desc.substring(0, descMaxLength).trim()}&#8230;</>
  }

  return (
    <Hover>
      {({ bind, hovered }) => (
        <Box
          width={[1, 1 / 3, 1 / 3, 1 / 4]}
          px={3}
          py={2}
          m={2}
          transition="0.15s all ease-in-out"
          transform={hovered ? 'translateY(-5px)' : 'none'}
          color="blue.dark"
          border="1px solid"
          borderColor="blue.mid"
          borderRadius={6}
          boxShadow="card"
          style={{
            willChange: 'transform'
          }}
          bg="white"
          flexGrow={1}
          {...bind}
        >
          <Flex
            width="100%"
            is="a"
            href={website}
            target="_blank"
            alignItems="center"
            style={{
              textDecoration: 'none',
              color: 'black !important',
              textOverflow: 'ellipsis'
            }}
          >
            <Box flexShrink={0} width={[60]}>
              <Image
                maxWidth="100%"
                width="100%"
                display="block"
                src={imgixImageUrl}
                alt={name}
              />
            </Box>
            <Box pl={3}>
              <Box>
                <Box>
                  <Type
                    style={{
                      textDecoration: hovered ? 'underline' : 'none'
                    }}
                    color="blue.dark"
                    fontSize={2}
                    fontWeight={600}
                  >
                    {app.name}
                  </Type>
                </Box>
                <Box>
                  <Type pt={1} color="blue.dark">
                    {desc}
                  </Type>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Box>
      )}
    </Hover>
  )
}

const HomeScreenPage = props => {
  const loading = props.apps && props.apps.loading && !props.apps.topApps.length
  return (
    <Box bg="blue.light">
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
