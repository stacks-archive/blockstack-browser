import React from 'react'
import PropTypes from 'prop-types'
import memoize from 'memoize-one'
import { Shell } from '@ui/containers/shell'
import { Header } from '@ui/containers/headers'
import { Transition } from 'react-spring'
import { WindowSize } from 'react-fns'
const ShellContext = React.createContext()

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

  getContext = memoize(({ invert, view, loadingProps }) => ({
    invert,
    view,
    loadingProps,
    setLoadingProps: this.setLoadingProps,
    backView: this.props.backView,
    clearLoadingProps: this.clearLoadingProps
  }))

  render() {
    const {
      views,
      app,
      invertOnLast,
      backOnLast,
      disableBackOnView,
      disableBack,
      size,
      view,
      maxHeight,
      ...rest
    } = this.props

    const isFirstView = view === 0
    const isLastView = view === views.length - 1

    const invert = invertOnLast && isLastView

    const defaultBackLabel = isFirstView ? '' : 'Back'
    const label =
      isFirstView && app ? `Back to ${app.name}` : defaultBackLabel

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
            label,
            disableBackOnView,
            disable: disableBack,
            view
          }
        : {
            action:
              isFirstView && !app ? undefined : () => this.props.backView(),
            app,
            label,
            disableBackOnView,
            disable: disableBack,
            view
          }

    const context = this.getContext({
      ...this.state,
      invert
    })

    return (
      <WindowSize>
        {windowSize => (
          <ShellContext.Provider value={{ ...context, size: windowSize }}>
            <Shell {...context} {...windowSize} maxHeight={maxHeight}>
              <Shell.Content.Container {...windowSize}>
                <Shell.Content.Wrapper {...windowSize}>
                  <Header
                    {...headerProps}
                    invert={windowSize.width < 600 ? invert : undefined}
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
  invertOnLast: PropTypes.bool,
  backView: PropTypes.func,
  views: PropTypes.array.isRequired,
  disableBackOnView: PropTypes.number,
  disableBack: PropTypes.bool,
  maxHeight: PropTypes.bool,
  size: PropTypes.object,
  view: PropTypes.number.isRequired
}
export default ShellParent

export { ShellContext }
