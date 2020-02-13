import React from 'react';
import Identity from '@blockstack/keychain/dist/identity';
import { Flex, Text, Button } from '@blockstack/ui';

import { Accounts } from '@components/accounts';

interface SignOutPros {
  identities: Identity[];
  signOut: () => void;
}

export const SignOut = ({ identities, signOut }: SignOutPros) => (
  <Flex flexDirection="column" maxWidth={[null, '320px']} mt={[null, '6vh', '12vh']}>
    <Text as="h1" fontWeight="bold" mb={6} display="block">
      Sign out
    </Text>
    <Accounts identities={identities} />
    <Button onClick={signOut} mt={8} width="100%">
      Sign out
    </Button>
    <Text as="small" color="ink.600" textAlign="center" mt={4}>
      This will sign you out on this device. To sign back in, you will have to enter your Secret Key.
    </Text>
  </Flex>
);
