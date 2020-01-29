import React from 'react';
import { Box, Flex, Text } from '@blockstack/ui';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';
import { useAppDetails } from '../../hooks/useAppDetails';
import { Logo } from '../logo';
import { AppIcon } from '../app-icon';

interface HeaderTitleProps {
  title?: string | JSX.Element;
  hideLogo?: boolean;
}

const HeaderTitle: React.FC<HeaderTitleProps> = ({ hideLogo, title }) => (
  <Flex align="center">
    {hideLogo ? null : <Logo mr={2} />}
    <Text fontWeight="bold" fontSize={'12px'}>
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
  title = 'Data Vault',
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
      mb={6}
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
          <Box pr={1} pl={2} color="ink.300">
            <ChevronRightIcon size={20} />
          </Box>
        ) : null}
        <HeaderTitle hideLogo={hideLogo} title={title} />
      </Flex>
    </Flex>
  );
};
