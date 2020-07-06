import React from 'react';
import { Flex, Text, Button, FlexProps } from '@blockstack/ui';
import { Accounts } from '@components/accounts';

import { useWallet } from '@common/hooks/use-wallet';

interface SignOutProps extends FlexProps {
  signOut: () => void;
  buttonMode?: 'primary' | 'secondary';
}

export const SignOut = ({ buttonMode = 'primary', signOut, ...rest }: SignOutProps) => {
  const { identities } = useWallet();
  return (
    <Flex flexDirection="column" maxWidth={[null, '320px']} mt={[null, '6vh', '12vh']} {...rest}>
      <Text as="h1" fontWeight="bold" mb={6} display="block">
        Sign out
      </Text>
      <Accounts identities={identities} />
      <Button mode={buttonMode} onClick={signOut} mt={8} width="100%">
        Sign out
      </Button>
      <Text as="small" color="ink.600" textAlign="center" mt={4}>
        This will sign you out on this device. To sign back in, you will have to enter your Secret
        Key.
      </Text>
    </Flex>
  );
};
