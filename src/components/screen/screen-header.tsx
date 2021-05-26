import React from 'react';
import { Flex, Text } from '@stacks/ui';
import { AppIcon } from '../app-icon';
import { useAppDetails } from '@common/hooks/auth/use-app-details';

export interface ScreenHeaderProps {
  title?: string | JSX.Element;
  rightContent?: React.FC | JSX.Element;
  close?: () => void;
  hideLogo?: boolean;
}

export const ScreenHeader = ({
  hideLogo = false,
  rightContent,
  title: _title,
  ...rest
}: ScreenHeaderProps) => {
  const { name } = useAppDetails();
  return (
    <Flex
      py={[4, 5]}
      px="base"
      height="56px"
      borderBottom="1px solid"
      borderBottomColor="inherit"
      borderRadius={['unset', '6px 6px 0 0']}
      bg="white"
      alignItems="center"
      justifyContent="space-between"
      {...rest}
    >
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Flex alignItems="center">
          {hideLogo ? null : <AppIcon mr="tight" />}
          <Text fontWeight={500} textStyle={'body.small.medium'} fontSize={'12px'}>
            {name}
          </Text>
        </Flex>
        {rightContent ? rightContent : null}
      </Flex>
    </Flex>
  );
};
