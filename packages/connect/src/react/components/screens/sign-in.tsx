import React from 'react';
import { Flex, Text } from '@blockstack/ui';
import { Logo } from '../logo';
import { useHover } from 'use-events';
import { useConnect } from '../../hooks/use-connect';

const ContinueWithAuth: React.FC = props => {
  const { authenticate, authOptions } = useConnect();
  const [hovered, bind] = useHover();
  return (
    <Flex
      textAlign="center"
      width="100%"
      align="center"
      justifyContent="center"
      border="1px solid"
      borderColor="inherit"
      px="loose"
      py="base-tight"
      borderRadius="6px"
      boxShadow="mid"
      height={14}
      transition="250ms all"
      cursor={hovered ? 'pointer' : 'unset'}
      bg={hovered ? 'rgba(0,0,0,0.02)' : 'white'}
      transform={hovered ? 'translateY(-2px)' : 'none'}
      onClick={() => {
        void authenticate({ ...authOptions, sendToSignIn: true });
      }}
      {...bind}
      {...props}
    >
      <Logo mr="tight" />
      <Text fontWeight={500}>Continue with Secret Key</Text>
    </Flex>
  );
};

export { ContinueWithAuth };
