import React from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import { Shell } from '@ui/containers/shell'
import { Logo } from '@blockstack/ui/components/logos'
import { Header } from '@ui/containers/headers'
import { Transition } from 'react-spring/dist/react-spring.umd'
import { Type } from '@ui/components/typography'
import { WindowSize } from 'react-fns'
const ShellContext = React.createContext()

const defaultDesktopProps = {
  heading: 'Welcome to the Blockstack Browser',
  body: (
    <React.Fragment>
      <Type.h3 color="rgba(255,255,255,0.6)">
        Join the new Internet and use apps that put you back in control.
      </Type.h3>
      <Type.small color="rgba(255,255,255,0.6)" padding="15px 0 0 0">
        Blockstack IDs gives you control over your fundamental digital rights:
        identity, data ownership, privacy, and security.
      </Type.small>
    </React.Fragment>
  )
}

/**
 * Shell parent is the wrapper for our various screens
 */
class ShellParent extends React.Component {
  state = {
    invert: false,
    loadingProps: {}
  }
  /**
   * Render a loading component from within a child view
   */
  renderLoading = props => {
    let Components = []

    if (props.children) {
      Components = [Shell.Loading]
    } else {
      Components = []
    }

    return (
      <Transition
        keys={Components.map((item, i) => i)}
        from={{ opacity: 0 }}
        enter={{ opacity: 1 }}
        leave={{ opacity: 0 }}
      >
        {Components.map((Component, i) => styles => (
          <Component key={i} style={styles} {...props} />
        ))}
      </Transition>
    )
  }
  /**
   * Sets the props that are used in the Loading component
   */
  setLoadingProps = loadingProps =>
    !this.state.loadingProps.children &&
    loadingProps.children &&
    loadingProps.children !== this.state.loadingProps.children
      ? this.setState({ loadingProps })
      : null

  /**
   * Resets loading props (clears them away)
   */
  clearLoadingProps = () =>
    this.state.loadingProps.children && this.setState({ loadingProps: {} })

  getContext = memoize(({ invert, view, loadingProps }) => {
    return {
      invert,
      view,
      loadingProps,
      setLoadingProps: this.setLoadingProps,
      backView: this.props.backView,
      clearLoadingProps: this.clearLoadingProps
    }
  })

  render() {
    const {
      views,
      app,
      headerLabel,
      desktop = defaultDesktopProps,
      invertOnLast,
      lastHeaderLabel,
      backOnLast,
      size,
      view,
      ...rest
    } = this.props

    const isFirstView = view === 0
    const isLastView = view === views.length - 1

    const invert = invertOnLast && isLastView

    const backLabel =
      isFirstView && headerLabel
        ? headerLabel
        : isFirstView && app ? `Back to ${app.name}` : isFirstView ? '' : 'Back'

    const Component = views[view]

    const componentProps = {
      backView: () => this.props.backView(),
      setLoadingProps: p => this.setLoadingProps(p),
      clearLoadingProps: this.clearLoadingProps,
      app,
      ...size,
      ...rest
    }

    const headerProps =
      !isFirstView && isLastView && !backOnLast
        ? {
            app,
            label: lastHeaderLabel && isLastView ? lastHeaderLabel : backLabel
          }
        : {
            action:
              isFirstView && !app ? undefined : () => this.props.backView(),
            app,
            label: backLabel
          }

    const context = this.getContext({
      ...this.state,
      invert
    })

    /**
     * Desktop only sidebar
     * can contain varying data based off of view
     * eg: different helper texts / educate what blockstack is
     */
    const DesktopSidebar = () => (
      <Shell.Sidebar>
        <Shell.Sidebar.Content>
          <Shell.Sidebar.Logo>
            <Logo />
          </Shell.Sidebar.Logo>
          <Type.h1 color="white">{desktop.heading}</Type.h1>
          <Type.p color="rgba(255,255,255,0.5)">{desktop.body}</Type.p>
        </Shell.Sidebar.Content>
      </Shell.Sidebar>
    )

    return (
      <WindowSize>
        {size => (
          <ShellContext.Provider value={{ ...context, size }}>
            <Shell {...context} {...size}>
              <DesktopSidebar />
              <Shell.Content.Container>
                <Shell.Content.Wrapper>
                  <Header
                    {...headerProps}
                    invert={size.width < 900 ? invert : undefined}
                  />
                  <Shell.Main>
                    {this.renderLoading(this.state.loadingProps)}
                    <Component {...componentProps} />
                  </Shell.Main>
                </Shell.Content.Wrapper>
              </Shell.Content.Container>
            </Shell>
          </ShellContext.Provider>
        )}
      </WindowSize>
    )
  }
}

ShellParent.propTypes = {
  app: PropTypes.object,
  backOnLast: PropTypes.bool,
  desktop: PropTypes.object,
  headerLabel: PropTypes.node,
  invertOnLast: PropTypes.bool,
  lastHeaderLabel: PropTypes.node,
  views: PropTypes.array.isRequired
}
export default ShellParent

export { ShellContext }
