import React from 'react';
import { Box, Flex, Text, ChevronIcon } from '@blockstack/ui';
import { useAppDetails } from '../../hooks/use-app-details';
import { Logo } from '../logo';
import { AppIcon } from '../app-icon';

interface HeaderTitleProps {
  title?: string | JSX.Element;
  hideLogo?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ hideLogo, title }) => (
  <Flex align="center">
    {hideLogo ? null : <Logo mr={2} />}
    <Text fontWeight={500} textStyle={'body.small.medium'} fontSize={'12px'}>
      {title}
    </Text>
  </Flex>
);

export interface ScreenHeaderProps {
  appDetails?: {
    name: string;
    icon: string;
  };
  title?: string | JSX.Element;
  close?: () => void;
  hideIcon?: boolean;
  hideLogo?: boolean;
}

export const ScreenHeader = ({
  appDetails,
  title = 'Secret Key',
  hideIcon = false,
  hideLogo = false,
  ...rest
}: ScreenHeaderProps) => {
  const { name, icon } = useAppDetails();

  let appName = name;
  let appIcon = icon;

  if (appDetails) {
    appName = appDetails.name;
    appIcon = appDetails.icon;
  }

  return (
    <Flex
      p={[4, 5]}
      height="56px"
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      {...rest}
    >
      <Flex align="center">
        {!hideIcon ? <AppIcon src={appIcon} alt={appName || 'loading'} /> : null}
        {!hideIcon ? (
          <Box mx={1} color="ink.300">
            <ChevronIcon direction="right" />
          </Box>
        ) : null}
        <HeaderTitle hideLogo={hideLogo} title={title} />
      </Flex>
    </Flex>
  );
};
