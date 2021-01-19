import React from 'react';
import { Button, Text, Box, space, ButtonGroup } from '@blockstack/ui';
import { useConnect } from '@stacks/connect-react';

export const Auth: React.FC = () => {
  const { doOpenAuth } = useConnect();
  return (
    <Box>
      <Text display="block" textStyle="body.large">
        Sign in with your Stacks Wallet to try out a demo of the Stacks 2.0 blockchain.
      </Text>
      <ButtonGroup spacing={space('base')} mt={space('base-loose')}>
        <Button size="lg" mode="primary" onClick={() => doOpenAuth()} data-test="sign-up">
          Sign up
        </Button>
      </ButtonGroup>
    </Box>
  );
};
