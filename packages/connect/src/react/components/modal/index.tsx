import React from 'react';
import { Modal as BlockstackModal, ThemeProvider, theme, CSSReset, Flex, Box, Text, ChevronIcon } from '@blockstack/ui';
import { useHover } from 'use-events';
import { Logo } from '../logo';
import { Intro } from '../screens/intro';
import { Finished } from '../screens/finished';
import { HowItWorks } from '../screens/how-it-works';
import { ContinueWithAuth } from '../screens/sign-in';
import { useConnect } from '../../hooks/useConnect';
import { useScrollLock } from '../../hooks/useScrollLock';
import { States } from '../connect/context';

const CloseIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16">
    <path
      fill="#C1C3CC"
      fillRule="evenodd"
      d="M4.817 3.403a1 1 0 00-1.414 1.414L6.586 8l-3.183 3.183a1 1 0 001.414 1.415L8 9.415l3.183 3.183a1 1 0 101.415-1.415L9.415 8l3.183-3.183a1.002 1.002 0 00-.325-1.631 1 1 0 00-1.09.217L8 6.586 4.817 3.403z"
      clipRule="evenodd"
    />
  </svg>
);

interface HeaderTitleProps {
  title: string;
  hideIcon?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ hideIcon = false, title }) => (
  <Flex align="center">
    {hideIcon ? null : <Logo mr={2} />}
    <Text fontWeight={500} fontSize={'12px'}>
      {title}
    </Text>
  </Flex>
);

interface ModalHeader {
  title: string;
  close?: boolean;
  back?: any;
  hideIcon?: boolean;
}

const ModalHeaderIconButton = ({ size, ...props }: any) => {
  const [hover, bind] = useHover();
  const Icon = props.icon;

  return (
    <Box as="button" cursor={hover ? 'pointer' : 'unset'} {...bind} {...props}>
      <Icon direction="left" size={size} />
    </Box>
  );
};

const ModalHeader = ({ title, back, hideIcon, close, ...rest }: ModalHeader) => {
  const { doCloseAuth, doChangeScreen } = useConnect();
  return (
    <Flex
      p={4}
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      position="relative"
      borderBottom={back ? '1px solid' : 'unset'}
      borderBottomColor="inherit"
      {...rest}
    >
      {back ? <ModalHeaderIconButton onClick={() => doChangeScreen(back)} icon={ChevronIcon} size={22} /> : null}
      <Flex align="center" mx={back ? 'auto' : 'unset'} transform={back ? 'translateX(-15px)' : 'unset'}>
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
      {close ? <ModalHeaderIconButton size={16} icon={CloseIcon} onClick={doCloseAuth} /> : null}
    </Flex>
  );
};

const RenderScreen: React.FC = () => {
  const { screen } = useConnect();
  switch (screen) {
    case States.SCREENS_FINISHED: {
      return <Finished />;
    }
    case States.SCREENS_HOW_IT_WORKS: {
      return <HowItWorks />;
    }
    case States.SCREENS_SIGN_IN: {
      return (
        <Box width="100%" p={5}>
          <ContinueWithAuth />
        </Box>
      );
    }
    default: {
      return <Intro />;
    }
  }
};

export const Modal = () => {
  const { isOpen, screen } = useConnect();
  useScrollLock(isOpen);

  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BlockstackModal
        headerComponent={
          <ModalHeader
            close
            back={screen === States.SCREENS_HOW_IT_WORKS ? States.SCREENS_INTRO : undefined}
            title={screen === States.SCREENS_SIGN_IN ? 'Sign In' : 'Secret Key'}
          />
        }
        isOpen={isOpen}
      >
        <RenderScreen />
      </BlockstackModal>
    </ThemeProvider>
  );
};
