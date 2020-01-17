import React from 'react';
import { Modal as BlockstackModal, ThemeProvider, theme, CSSReset, Flex, Box, Text } from '@blockstack/ui';
import CloseIcon from 'mdi-react/CloseIcon';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import { useHover } from 'use-events';
import { Logo } from '../logo';
import { Intro } from '../screens/intro';
import { Finished } from '../screens/finished';
import { HowItWorks } from '../screen/how-it-works';
import { ContinueWithDataVault } from '../screen/sign-in';
import { useConnect } from '../../hooks/useConnect';
import { States } from '../connect/context';

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

interface IModalHeader {
  title: string;
  close?: boolean;
  back?: any;
  hideIcon?: boolean;
}

const ModalHeaderIconButton = (props: any) => {
  const [hover, bind] = useHover();
  const Icon = props.icon;

  return (
    <Box cursor={hover ? 'pointer' : 'unset'} opacity={hover ? 1 : 0.5} {...bind} {...props}>
      <Icon size={20} />
    </Box>
  );
};

const ModalHeader = ({ title, back, hideIcon, close, ...rest }: IModalHeader) => {
  const { doCloseDataVault, doChangeScreen } = useConnect();

  return (
    <Flex
      p={[4, 5]}
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      position="relative"
      borderBottom={back ? '1px solid' : 'unset'}
      borderBottomColor="inherit"
      {...rest}
    >
      {back ? <ModalHeaderIconButton onClick={() => doChangeScreen(back)} icon={ChevronLeftIcon} /> : null}
      <Flex align="center" mx={back ? 'auto' : 'unset'} transform={back ? 'translateX(-15px)' : 'unset'}>
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
      {close ? <ModalHeaderIconButton icon={CloseIcon} onClick={doCloseDataVault} /> : null}
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
          <ContinueWithDataVault />
        </Box>
      );
    }
    default: {
      return <Intro />;
    }
  }
};

const Modal = () => {
  const { isOpen, screen } = useConnect();
  return (
    <ThemeProvider theme={theme}>
      <CSSReset />
      <BlockstackModal
        headerComponent={
          <ModalHeader
            close
            back={screen === States.SCREENS_HOW_IT_WORKS ? States.SCREENS_INTRO : undefined}
            title={screen === States.SCREENS_SIGN_IN ? 'Sign In' : 'Data Vault'}
          />
        }
        isOpen={isOpen}
      >
        <RenderScreen />
      </BlockstackModal>
    </ThemeProvider>
  );
};

export { Modal };
