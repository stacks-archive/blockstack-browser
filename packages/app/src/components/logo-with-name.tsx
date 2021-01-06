import React from 'react';
import { Flex, Text } from '@stacks/ui';
import { Logo } from './logo';

interface LogoWithNameProps {
  title?: string;
  hideIcon?: boolean;
}

export const LogoWithName: React.FC<LogoWithNameProps> = ({
  title = 'Secret Key',
  hideIcon = false,
}) => (
  <Flex alignItems="center">
    {hideIcon ? null : <Logo mr={2} />}
    <Text fontWeight="bold" fontSize={'12px'}>
      {title}
    </Text>
  </Flex>
);
