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
  <Box maxWidth={1280} width="100%" mx="auto" p={[1, 2, 4]} {...rest}>
    <AppsSection title="Popular Apps" apps={topApps} limit={24} />
    {allApps
      .sort((a, b) => a.label.localeCompare(b.label))
      .map(category => {
        const apps = category.apps.sort((a, b) => a.name.localeCompare(b.name))
        return <AppsSection title={category.label} apps={apps} />
      })}
  </Box>
)

const AppsSection = ({ title, apps, limit, category, ...rest }) => {
  let appsList = apps.filter(app => app.imgixImageUrl)
  if (limit) {
    appsList = appsList.filter((app, i) => i <= limit - 1)
  }
  if (category) {
    appsList = appsList.filter(app => app.category === category)
  }
  return (
    <Box
      width={1}
      mx="auto"
      p={4}
      mb={4}
      borderBottom="1px solid rgba(15,15,15,0.1)"
      {...rest}
    >
      <Box textAlign="center">
        <p className="app-section-heading">{title}</p>
      </Box>
      <Flex pt={4} flexWrap="wrap" justifyContent={['center', 'space-between']}>
        {appsList.map(app => (
          <AppItem
            key={app.name}
            name={app.name}
            imgixImageUrl={app.imgixImageUrl}
            website={app.website}
            description={app.description}
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
    boxShadow="1px 0px 18px 0px rgba(0, 0, 0, 0.1)"
    bg="white"
    {...props}
  />
)

const AppItem = ({ website, imgixImageUrl, name, description }) => {
  const descMaxLength = 55
  let desc = description.trim()

  if (description[description.length - 1] !== '.') {
    desc += '.'
  }

  if (description.length > descMaxLength) {
    desc = <>{desc.substring(0, descMaxLength).trim()}&#8230;</>
  }

  return (
    <Hover>
      {({ bind, hovered }) => (
        <Flex
          width={['calc(50% - 10px)', 1 / 3, 1 / 3, 1 / 4]}
          maxWidth={['160px', 'unset', 'unset', 'unset']}
          pr={[0, 3, 3, 4]}
          mb={5}
          flexShrink={0}
          flexGrow="1"
          alignSelf="stretch"
          transition="0.15s all ease-in-out"
          transform={hovered ? 'translateY(-5px)' : 'none'}
          color="blue.dark"
          {...bind}
        >
          <Flex
            maxWidth="100%"
            width={1}
            is="a"
            flexGrow={1}
            href={website}
            target="_blank"
            alignItems="center"
            flexDirection={['column', 'row', 'row', 'row']}
            textAlign={['center', 'left', 'left', 'left']}
            style={{
              textDecoration: 'none',
              color: 'black !important'
            }}
          >
            <Image
              maxWidth="100%"
              size="64px"
              display="block"
              flexShrink="0"
              src={imgixImageUrl}
              alt={name}
            />
            <Box ml={[0, 3, 3, 3]} mt={[3, 0, 0, 0]}>
              <Box>
                <Type
                  is="h3"
                  fontSize={[2]}
                  lineHeight={1.45}
                  fontWeight="600"
                  color="black !important"
                  mb={1}
                >
                  {name}
                </Type>
              </Box>
              <Box
                opacity={0.75}
                color="black !important"
                style={{
                  hyphens: 'auto'
                }}
              >
                {desc}
              </Box>
            </Box>
          </Flex>
        </Flex>
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
            allApps={!loading && props.apps.appsByCategory}
            topApps={!loading && props.apps.topApps}
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
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
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
