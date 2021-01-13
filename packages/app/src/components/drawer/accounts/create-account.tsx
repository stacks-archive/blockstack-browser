import React, { useCallback, useEffect } from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';

interface CreateAccountProps {
  close: () => void;
}
export const CreateAccount: React.FC<CreateAccountProps> = ({ close }) => {
  const { doCreateNewAccount } = useWallet();

  const createAccount = useCallback(async () => {
    await doCreateNewAccount();
    setTimeout(() => close(), 3000);
  }, [doCreateNewAccount, close]);

  useEffect(() => {
    void createAccount();
  }, [createAccount]);
  return (
    <Box width="100%" px={6}>
      <Box>
        <Text fontSize={4} fontWeight="600">
          Account Created
        </Text>
      </Box>
      <Box py="base">
        <Text fontSize={2}>Your new account has been created.</Text>
      </Box>
      <Flex width="100%" flexGrow={1} mt="base">
        <Button width="100%" ml={2} onClick={close}>
          Done
        </Button>
      </Flex>
    </Box>
  );
};
