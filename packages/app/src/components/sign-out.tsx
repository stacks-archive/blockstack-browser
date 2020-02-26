import React from 'react';
import { Identity } from '@blockstack/keychain';
import { Flex, Text, Button, FlexProps } from '@blockstack/ui';

import { Accounts } from '@components/accounts';

interface SignOutProps extends FlexProps {
  identities: Identity[];
  signOut: () => void;
  buttonMode?: 'primary' | 'secondary';
}

export const SignOut = ({ buttonMode = 'primary', identities, signOut, ...rest }: SignOutProps) => (
  <Flex flexDirection="column" maxWidth={[null, '320px']} mt={[null, '6vh', '12vh']} {...rest}>
    <Text as="h1" fontWeight="bold" mb={6} display="block">
      Sign out
    </Text>
    <Accounts identities={identities} />
    <Button mode={buttonMode} onClick={signOut} mt={8} width="100%">
      Sign out
    </Button>
    <Text as="small" color="ink.600" textAlign="center" mt={4}>
      This will sign you out on this device. To sign back in, you will have to enter your Secret Key.
    </Text>
  </Flex>
);
