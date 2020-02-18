import React from 'react';
import { Box } from '../box';
import { Flex } from '../flex';
import { ModalContextTypes, ModalProps, WrapperComponentProps } from './types';
import useOnClickOutside from 'use-onclickoutside';
import { transition } from '../theme/theme';

const ModalContext = React.createContext<ModalContextTypes>({
  isOpen: false,
});

const useModalState = () => React.useContext(ModalContext);

const ModalContent: React.FC = ({ children, ...rest }) => (
  <Flex width="100%" height="100%" {...rest}>
    {children}
  </Flex>
);

const Header = ({ component }: WrapperComponentProps) =>
  component ? (
    <Box borderTopRightRadius="6px" borderTopLeftRadius="6px">
      {component}
    </Box>
  ) : null;

const Footer = ({ component }: WrapperComponentProps) =>
  component ? (
    <Box borderBottomRightRadius="6px" borderBottomLeftRadius="6px">
      {component}
    </Box>
  ) : null;

const Modal: React.FC<ModalProps> = ({
  footerComponent: FooterComponent = null,
  headerComponent: HeaderComponent = null,
  isOpen = false,
  children,
  noAnimation = false,
  close,
  ...rest
}) => {
  const { doCloseModal } = useModalState();
  const ref = React.useRef(null);
  useOnClickOutside(ref, close || doCloseModal);
  return (
    <Flex
      position="fixed"
      size="100%"
      left={0}
      top={0}
      align={['flex-end', 'center']}
      justify="center"
      bg={`rgba(0,0,0,${isOpen ? '0.48' : '0'})`}
      opacity={isOpen ? 1 : 0}
      zIndex={9999999}
      transition={noAnimation ? 'unset' : 'all 0.2s'}
      style={{
        userSelect: isOpen ? 'unset' : 'none',
        pointerEvents: isOpen ? 'unset' : 'none',
      }}
      {...rest}
    >
      <Flex
        bg="white"
        direction="column"
        minWidth={['100%', '396px']}
        width="100%"
        maxWidth={['100%', '396px']}
        maxHeight={['100vh', 'calc(100vh - 48px)']}
        borderRadius={['unset', '6px']}
        boxShadow="high"
        transform={isOpen ? 'none' : noAnimation ? 'none' : 'translateY(10px)'}
        transition={noAnimation ? 'unset' : transition}
        ref={ref}
      >
        <Header component={HeaderComponent} />
        <Flex width="100%" overflowY="auto" flexGrow={1} position="relative">
          <ModalContent>{children}</ModalContent>
        </Flex>
        <Footer component={FooterComponent} />
      </Flex>
    </Flex>
  );
};

const ModalProvider: React.FC = props => {
  const [isOpen, setIsOpen] = React.useState(false);
  const doOpenModal = () => (!isOpen ? setIsOpen(true) : null);
  const doCloseModal = () => (isOpen ? setIsOpen(true) : null);
  return (
    <ModalContext.Provider
      value={{
        isOpen,
        doOpenModal,
        doCloseModal,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export { ModalProvider, Modal, useModalState };
