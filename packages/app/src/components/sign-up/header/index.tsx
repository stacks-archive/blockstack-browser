import React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import { useSelector } from 'react-redux';

import { selectAppIcon } from '../../../store/onboarding/selectors';

import { Logo } from '../../logo';
import { Image } from '../../image';

interface AppIconProps {
  src?: string;
  name?: string;
}

const AppIcon: React.FC<AppIconProps> = ({ src, name, ...rest }) => (
  <Box size={6} {...rest}>
    <Image src={src} alt={name} title={name} />
  </Box>
);

interface HeaderTitleProps {
  title?: string | JSX.Element;
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

interface ScreenHeaderProps {
  appIcon?: boolean;
  appName?: string;
  title?: string | JSX.Element;
  close?: () => void;
  hideIcon?: boolean;
}

export const ScreenHeader = ({ appIcon, title = 'Data Vault', hideIcon, appName, ...rest }: ScreenHeaderProps) => {
  const icon = useSelector(selectAppIcon);

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
        {appIcon ? <AppIcon src={icon} name={appName || 'loading'} /> : null}
        {appIcon ? (
          <Box pr={1} pl={2} color="ink.300">
            <ChevronRightIcon size={20} />
          </Box>
        ) : null}
        <HeaderTitle hideIcon={hideIcon} title={title} />
      </Flex>
    </Flex>
  );
};
