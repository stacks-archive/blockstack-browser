import React from 'react';
import { Button, Text, Box, space, ButtonGroup } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect-react';

export const Auth: React.FC = () => {
  const { doOpenAuth } = useConnect();
  return (
    <Box>
      <Text display="block" textStyle="body.large">
        Sign in with your Blockstack account to try the demo
      </Text>
      <ButtonGroup spacing={space('base')} mt={space('base-loose')}>
        <Button size="lg" onClick={() => doOpenAuth(true)} data-test="sign-in">
          Sign in
        </Button>
        <Button size="lg" mode="tertiary" onClick={() => doOpenAuth()} data-test="sign-up">
          Sign up
        </Button>
      </ButtonGroup>
    </Box>
  );
};
