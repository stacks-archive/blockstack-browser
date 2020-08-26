import React from 'react';
import { Flex, Text } from '@blockstack/ui';
import { selectAppName } from '@store/onboarding/selectors';
import { useSelector } from 'react-redux';
import { AppIcon } from '../app-icon';

export interface ScreenHeaderProps {
  title?: string | JSX.Element;
  rightContent?: React.FC | JSX.Element;
  close?: () => void;
  hideIcon?: boolean;
  hideLogo?: boolean;
}

export const ScreenHeader = ({
  hideLogo = false,
  rightContent,
  title: _title,
  ...rest
}: ScreenHeaderProps) => {
  const name = useSelector(selectAppName);
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
