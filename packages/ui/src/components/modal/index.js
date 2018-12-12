import React from 'react'
import { Backdrop, Overlay } from 'reakit'
import { Flex, Box, Card, Type } from '../../'
import { CloseIcon } from 'mdi-react'
import { Hover, Active } from 'react-powerplug'

const ModalContext = React.createContext()

const CloseButton = ({ ...rest }) => (
  <Active>
    {({ active, bind: activeBind }) => (
      <Hover>
        {({ hovered, bind }) => (
          <Flex
            cursor={hovered ? 'pointer' : null}
            opacity={hovered ? 1 : 0.5}
            transform={active ? 'translateY(2px)' : 'none'}
            {...bind}
            {...activeBind}
            {...rest}
          >
            <CloseIcon />
          </Flex>
        )}
      </Hover>
    )}
  </Active>
)

const Modal = ({
  title,
  children,
  hide,
  component: Component,
  header: Header,
  wrapper: Wrapper,
  visible,
  p = 4,
  ...rest
}) => {
  const ModalComponent = Component
    ? (props) => <Component hide={hide} {...props} />
    : (props) => (
        <Card
          p={0}
          flexGrow={1}
          width={['90vw', '70vw']}
          maxWidth="calc(100% - 40px)"
          maxHeight={'90vh'}
          {...props}
        />
      )

  const ModalHeader = Header
    ? (props) => <Header hide={hide} {...props} />
    : (props) => (
        <Flex
          justifyContent={'space-between'}
          borderBottom="1px solid"
          borderColor={'blue.mid'}
          px={4}
          py={3}
          flexShrink={0}
          {...props}
        />
      )
  const ContentWrapper = Wrapper
    ? (props) => <Wrapper hide={hide} {...props} />
    : (props) => (
        <Flex
          p={p}
          flexDirection="column"
          overflow="auto"
          flexGrow={1}
          {...props}
        />
      )

  return (
    <ModalComponent {...rest}>
      <ModalHeader>
        {title ? <Type fontWeight={500}>{title}</Type> : null}
        <CloseButton onClick={hide} />
      </ModalHeader>
      <ContentWrapper>{children}</ContentWrapper>
    </ModalComponent>
  )
}

class ModalRoot extends React.Component {
  state = {
    comp: null,
    previous: null,
    visible: false,
    alert: null
  }

  componentWillUnmount() {
    this.setState({
      comp: null
    })
  }

  componentWillUpdate(nextProps, nextState, nextContext) {
    if (
      nextState.comp &&
      this.state.comp &&
      nextState.comp.name !== this.state.comp.name &&
      !this.state.previous
    ) {
      this.setState({
        previous: this.state.comp
      })
    }
  }

  timeout = null

  handleShow = (show, comp) => {
    this.setState({ comp, visible: true })
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
    show()
  }

  handleHide = (hide) => {
    if (this.props.preventClose) {
      return null
    }
    if (this.state.previous) {
      this.setState({
        comp: this.state.previous,
        previous: null
      })
    } else {
      this.setState({
        previous: null
      })
      this.timeout = setTimeout(
        () => this.setState({ visible: false, comp: null, previous: null }),
        200
      )
      hide()
    }
  }

  render() {
    const { children } = this.props

    return (
      <Overlay.Container>
        {(overlay) => {
          const props = {
            ...overlay,
            show: (comp) => this.handleShow(overlay.show, comp),
            hide: () => this.handleHide(overlay.hide)
          }
          return (
            <ModalContext.Provider value={props}>
              <>
                {children}
                <Overlay
                  style={{
                    transform: 'none',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  fade
                  {...overlay}
                >
                  <Flex
                    justifyContent="center"
                    width={[1, 1, 'auto']}
                    position="relative"
                    zIndex={999}
                  >
                    {this.state.visible &&
                      this.state.comp({
                        hide: () => this.handleHide(overlay.hide),
                        visible: overlay.visible
                      })}
                  </Flex>
                  <Box color="hsla(225,50%,7%,0.75)">
                    <Backdrop
                      style={{ background: 'currentColor' }}
                      as={Overlay.Hide}
                      fade
                      {...overlay}
                      hide={() => this.handleHide(overlay.hide)}
                    />
                  </Box>
                </Overlay>
              </>
            </ModalContext.Provider>
          )
        }}
      </Overlay.Container>
    )
  }
}

const ModalConsumer = ModalContext.Consumer

const OpenModal = (props) => {
  const { component, children, title, content, ...rest } = props
  return (
    <ModalConsumer>
      {({ visible, show, hide }) =>
        children({
          bind: {
            onClick: () => show(component)
          }
        })
      }
    </ModalConsumer>
  )
}

export { ModalRoot, ModalConsumer, OpenModal, Modal }
