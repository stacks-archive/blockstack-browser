import React from 'react';
import { Box } from '../box';
import { Flex } from '../flex';
import { ModalContextTypes, ModalProps, WrapperComponentProps } from './types';
import useOnClickOutside from 'use-onclickoutside';
import { transition } from '../theme/theme';

const ModalContext = React.createContext<ModalContextTypes>({
  isOpen: false,
});

export const useModalState = () => React.useContext(ModalContext);

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

interface ModalUnderlayProps {
  isOpen?: boolean;
  noAnimation?: boolean;
}

const ModalUnderlay = ({ isOpen, noAnimation }: ModalUnderlayProps) => (
  <Box
    position="fixed"
    size="100%"
    left={0}
    right={0}
    top={0}
    bottom={0}
    bg={`rgba(0,0,0,${isOpen ? '0.48' : '0'})`}
    transition={noAnimation ? 'unset' : 'all 0.2s'}
    zIndex={99999}
    style={{
      userSelect: isOpen ? 'unset' : 'none',
      pointerEvents: isOpen ? 'unset' : 'none',
    }}
  />
);

export const Modal: React.FC<ModalProps> = ({
  footerComponent: FooterComponent = null,
  headerComponent: HeaderComponent = null,
  isOpen = false,
  children,
  noAnimation = false,
  close,
}) => {
  const { doCloseModal } = useModalState();
  const ref = React.useRef(null);
  useOnClickOutside(ref, close || doCloseModal);

  return (
    <>
      <ModalUnderlay isOpen={isOpen} noAnimation={noAnimation} />
      <Box
        zIndex={999999}
        position="fixed"
        bottom={[0, 'unset']}
        width="100%"
        height={[null, '100%']}
        maxHeight={['80vh', 'unset']}
        opacity={isOpen ? 1 : 0}
        style={{
          userSelect: isOpen ? 'unset' : 'none',
          pointerEvents: isOpen ? 'unset' : 'none',
        }}
      >
        <Flex
          flexDirection="column"
          position="relative"
          top={[null, '50%']}
          transform={[null, 'translateY(-50%)']}
          bg="white"
          mx="auto"
          minWidth={['100%', '396px']}
          maxWidth={['100%', '396px']}
          maxHeight="80vh"
          borderRadius={['unset', '6px']}
          boxShadow="high"
          transition={noAnimation ? 'unset' : transition}
        >
          <Header component={HeaderComponent} />
          <Box overflowY="auto">{children}</Box>
          <Footer component={FooterComponent} />
        </Flex>
      </Box>
    </>
  );
};

export const ModalProvider: React.FC = props => {
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

