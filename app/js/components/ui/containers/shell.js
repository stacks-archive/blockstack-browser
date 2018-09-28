import React from 'react'
import { Type } from '@ui/components/typography'
import { StyledShell } from '@ui/components/shell'
import { ActionButtons } from '@ui/containers/button'
import { FormContainer } from '@ui/containers/form'
import { withShellContext } from '@blockstack/ui/common/withOnboardingState'
import { Spring } from 'react-spring'
import { Spinner } from '@ui/components/spinner'
import { colors } from '@components/styled/theme'
import PropTypes from 'prop-types'
import { Flex, Box } from '@components/ui/components/primitives'

const Shell = props => <StyledShell {...props} />

const Subtitle = ({ variant = 'h3', ...rest }) => {
  const SubtitleComponent = Type[variant]
  return <SubtitleComponent {...rest} />
}

const Title = ({
  children,
  title,
  subtitle,
  icon,
  variant = 'h1',
  ...rest
}) => {
  const TitleComponent = Type[variant]
  return (
    <StyledShell.Title {...rest}>
      {icon && <StyledShell.Title.Section>{icon}</StyledShell.Title.Section>}
      <StyledShell.Title.Section
        style={icon && { maxWidth: 'calc(100% - 40px)' }}
      >
        <StyledShell.Title.Animated>
          <TitleComponent>{children || title}</TitleComponent>
        </StyledShell.Title.Animated>
        {subtitle && <Subtitle {...subtitle} />}
      </StyledShell.Title.Section>
    </StyledShell.Title>
  )
}

const Loading = ({ message = 'Loading...', children, ...rest }) => {
  const Content = () => (
    <Box>
      {children || (
        <Type fontSize="16px" pt={3} fontWeight={500}>
          {message}
        </Type>
      )}
    </Box>
  )
  return (
    <Spring native from={{ opacity: 0 }} to={{ opacity: 1 }}>
      {styles => (
        <StyledShell.Loading {...rest} style={styles}>
          <Flex
            pt={3}
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <Spinner color={colors.blue} size={42} stroke={3} />
            <Content />
          </Flex>
        </StyledShell.Loading>
      )}
    </Spring>
  )
}
Loading.propTypes = {
  message: PropTypes.node,
  children: PropTypes.node
}

Shell.Title = Title
Shell.Loading = Loading

Shell.Main = StyledShell.Main
Shell.Content = StyledShell.Content
Shell.Wrapper = StyledShell.Wrapper
Shell.Actions = StyledShell.Actions
Shell.Sidebar = StyledShell.Sidebar
Shell.Content.Container = StyledShell.Content.Container

const Content = ({ children, form, ...rest }) => (
  <StyledShell.Content {...rest}>
    {form && <FormContainer {...form} />}
    {children}
  </StyledShell.Content>
)

Content.defaultProps = {
  grow: 1
}
Content.propTypes = {
  children: PropTypes.node,
  form: PropTypes.object,
  grow: PropTypes.oneOf([0, 1]).isRequired
}

const ShellScreenContainer = ({ title, actions, content, ...rest }) => (
  <Shell.Wrapper {...rest}>
    {title ? <Shell.Title {...title} /> : null}
    <Content {...content} />
    {actions ? (
      <Shell.Actions>
        <ActionButtons {...actions} />
      </Shell.Actions>
    ) : null}
  </Shell.Wrapper>
)

ShellScreenContainer.propTypes = {
  actions: PropTypes.object,
  title: PropTypes.object,
  loading: PropTypes.object,
  content: PropTypes.object,
  titleVariation: PropTypes.oneOf(['h1', 'h2'])
}

Subtitle.propTypes = {
  variant: PropTypes.string
}
Title.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  variant: PropTypes.oneOf(['h1', 'h2'])
}
const ShellScreen = withShellContext(ShellScreenContainer)

export { Shell, ShellScreen }
