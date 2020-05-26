import React from 'react';
import { Flex } from '@blockstack/ui';
import { Link, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { ColorModeButton } from '@components/color-mode-button';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { SideNav } from './side-nav';
import GithubIcon from 'mdi-react/GithubIcon';
import { IconButton } from '@components/icon-button';
import { color, space } from '@common/utils';

const MenuButton = ({ ...rest }: any) => {
  const { isOpen, handleOpen, handleClose } = useMobileMenuState();
  const Icon = isOpen ? CloseIcon : MenuIcon;
  const handleClick = isOpen ? handleClose : handleOpen;
  return (
    <Flex
      color="var(--colors-invert)"
      display={['flex', 'flex', 'none']}
      onClick={handleClick}
      px={1}
    >
      <Icon color="currentColor" />
    </Flex>
  );
};

const GithubButton = ({ ...rest }: any) => {
  return (
    <IconButton
      as="a"
      href="https://github.com/blockstack/ux/tree/master/packages/ui#blockstack-ui"
      target="_blank"
    >
      <GithubIcon size="20px" />
    </IconButton>
  );
};

const Header = ({ ...rest }: any) => {
  const { isOpen } = useMobileMenuState();

  return (
    <>
      <Flex
        justifyContent="space-between"
        borderBottom="1px solid"
        borderColor="var(--colors-border)"
        align="center"
        px="base"
        position="fixed"
        width="100%"
        bg="var(--colors-bg)"
        zIndex={99}
        height="50px"
      >
        <Text fontSize="14px">Blockstack Design System</Text>
        <Flex align="center">
          <Link
            as="a"
            mr={space('base')}
            href="https://www.dropbox.com/work/Blockstack%20Branding"
            target="_blank"
            fontSize="12px"
          >
            Branding Assets
          </Link>
          <ColorModeButton />
          <GithubButton />
          <MenuButton />
        </Flex>
      </Flex>
      <SideNav
        position="fixed"
        top="50px"
        maxHeight="calc(100vh - 50px)"
        width="100%"
        zIndex={99}
        bg={color('bg')}
        display={isOpen ? ['block', 'block', 'none'] : 'none'}
      />
    </>
  );
};

export { Header };
