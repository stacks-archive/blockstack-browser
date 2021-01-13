import React from 'react';
import { Button, Text, Box, space, ButtonGroup } from '@blockstack/ui';
import { authenticateWithExtensionUrl } from '@stacks/connect';
import { useConnect } from '@stacks/connect-react';
import { getAuthOrigin } from '@common/utils';

export const Auth: React.FC = () => {
  const { authOptions, doOpenAuth } = useConnect();
  const auth = () => {
    if (location.href.includes('localhost:3001')) {
      const extensionUrl = getAuthOrigin();
      authenticateWithExtensionUrl({
        extensionUrl,
        authOptions,
      });
    } else {
      doOpenAuth();
    }
  };
  return (
    <Box>
      <Text display="block" textStyle="body.large">
        Sign in with your Stacks Wallet to try out a demo of the Stacks 2.0 blockchain.
      </Text>
      <ButtonGroup spacing={space('base')} mt={space('base-loose')}>
        <Button size="lg" mode="primary" onClick={() => auth()} data-test="sign-up">
          Sign up
        </Button>
      </ButtonGroup>
    </Box>
  );
};
