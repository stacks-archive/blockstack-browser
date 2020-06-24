import React from 'react';
import { Flex, Box, BlockstackIcon, color, space } from '@blockstack/ui';
import { Link, Text } from '@components/typography';
import MenuIcon from 'mdi-react/MenuIcon';
import CloseIcon from 'mdi-react/CloseIcon';
import { ColorModeButton } from '@components/color-mode-button';
import { useMobileMenuState } from '@common/hooks/use-mobile-menu';
import { SideNav } from './side-nav';
import GithubIcon from 'mdi-react/GithubIcon';
import { IconButton } from '@components/icon-button';
import { border } from '@common/utils';

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

const GithubButton = () => (
  <IconButton
    as="a"
    href="https://github.com/blockstack/ux/tree/master/packages/ui#blockstack-ui"
    target="_blank"
    title="Find us on GitHub"
    position="relative"
    overflow="hidden"
  >
    <Text position="absolute" opacity={0} as="label">
      Find us on GitHub
    </Text>
    <GithubIcon size="20px" />
  </IconButton>
);

const Header = ({ ...rest }: any) => {
  const { isOpen } = useMobileMenuState();

  return (
    <>
      <Flex
        justifyContent="space-between"
        borderBottom={border()}
        align="center"
        px="base"
        position="fixed"
        width="100%"
        bg={color('bg')}
        zIndex={99}
        height="50px"
        boxShadow="mid"
      >
        <Flex align="center">
          <Box color={color('invert')} mr={space('tight')}>
            <BlockstackIcon size="20px" />
          </Box>
          <Box>
            <Text color={color('invert')} fontSize="14px" fontWeight={600}>
              Blockstack UI
            </Text>
          </Box>
        </Flex>
        <Flex align="center">
          <Link
            as="a"
            mr={space('base')}
            href="https://www.dropbox.com/sh/5uyhon1dxax4t6t/AABnh34kFRzD2TSck1wE9fmqa?dl=0"
            target="_blank"
            fontSize="12px"
          >
            Branding Assets
          </Link>
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
        border="unset"
      />
    </>
  );
};

export { Header };
