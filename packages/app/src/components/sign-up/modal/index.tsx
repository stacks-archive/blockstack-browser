import React from 'react';
import { Box, PseudoBox, Flex, Text } from '@blockstack/ui';
import { Logo } from '../../logo';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { Image } from '../../image';
import { BoxProps } from '@blockstack/ui/dist/box';

interface ModalContextTypes {
  isOpen: boolean;
  doOpenModal?: () => void;
  doCloseModal?: () => void;
}

const ModalContext = React.createContext<ModalContextTypes>({
  isOpen: false,
});

const useModalState = () => React.useContext(ModalContext);

interface HeaderTitleProps {
  title: string;
  hideIcon?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ hideIcon = false, title }) => (
  <Flex align="center">
    {hideIcon ? null : <Logo mr={2} />}
    <Text fontWeight="bold" fontSize={'12px'}>
      {title}
    </Text>
  </Flex>
);

const HeaderCloseButton: React.FC<BoxProps> = ({ onClick }) => (
  <PseudoBox color="ink.300" opacity={0.5} _hover={{ opacity: 1, cursor: 'pointer' }} onClick={onClick}>
    <CloseIcon size={20} />
  </PseudoBox>
);

interface AppIconProps {
  src: string;
  name: string;
}

const AppIcon: React.FC<AppIconProps> = ({ src, name, ...rest }) => (
  <Box size={6} {...rest}>
    <Image src={src} alt={name} title={name} />
  </Box>
);

interface ModalHeader {
  appIcon?: string;
  appName?: string;
  title: string;
  close: () => void;
  hideIcon?: boolean;
}

const ModalHeader = ({ appIcon, close, title, hideIcon, appName, ...rest }: ModalHeader) => {
  return (
    <Flex
      p={[4, 5]}
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      {...rest}
    >
      <Flex align="center">
        {appIcon ? <AppIcon src={appIcon} name={appName || 'loading'} /> : null}
        {appIcon ? (
          <Box pr={1} pl={2} color="ink.300">
            <ChevronRightIcon size={20} />
          </Box>
        ) : null}
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
      <HeaderCloseButton onClick={close} />
    </Flex>
  );
};

const ModalContent: React.FC = ({ children, ...rest }) => {
  return (
    <Flex width="100%" height="100%" {...rest}>
      {children}
    </Flex>
  );
};

interface ModalProps {
  footer?: React.ReactNode;
  appIcon?: string;
  appName?: string;
  title: string;
  hideIcon?: boolean;
  close: () => void;
}

const Modal: React.FC<ModalProps> = ({ footer = null, appIcon, title, hideIcon = false, close, appName, children }) => {
  return (
    <>
      <Flex
        position="fixed"
        size="100%"
        left={0}
        top={0}
        align={['flex-end', 'center']}
        justify="center"
        bg="rgba(0,0,0,0.48)"
        zIndex={99}
      >
        <Flex
          bg="white"
          direction="column"
          minWidth={['100%', '440px']}
          width="100%"
          maxWidth={['100%', '440px']}
          maxHeight={['100vh', 'calc(100vh - 48px)']}
          borderRadius={['unset', '6px']}
          boxShadow="high"
        >
          <ModalHeader hideIcon={hideIcon} close={close} appIcon={appIcon} appName={appName} title={title} />
          <Flex width="100%" p={[5, 8]} overflowY="auto" flexGrow={1} position="relative">
            <ModalContent>{children}</ModalContent>
          </Flex>
          {footer ? footer : null}
        </Flex>
      </Flex>
    </>
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
