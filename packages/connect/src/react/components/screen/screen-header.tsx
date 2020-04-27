import React from 'react';
import { Flex, Text } from '@blockstack/ui';
import { useAppDetails } from '../../hooks/use-app-details';
import { AppIcon } from '../app-icon';

export interface ScreenHeaderProps {
  appDetails?: {
    name: string;
    icon: string;
  };
  title?: string | JSX.Element;
  rightContent?: React.FC | JSX.Element;
  close?: () => void;
  hideIcon?: boolean;
  hideLogo?: boolean;
}

export const ScreenHeader = ({
  appDetails,
  hideLogo = false,
  rightContent,
  title: _title,
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
      py={[4, 5]}
      px="base"
      height="56px"
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      align="center"
      justify="space-between"
      {...rest}
    >
      <Flex width="100%" align="center" justifyContent="space-between">
        <Flex align="center">
          {hideLogo ? null : <AppIcon src={appIcon} alt={appName || 'loading'} mr="tight" />}
          <Text fontWeight={500} textStyle={'body.small.medium'} fontSize={'12px'}>
            {appName}
          </Text>
        </Flex>
        {rightContent ? rightContent : null}
      </Flex>
    </Flex>
  );
};
