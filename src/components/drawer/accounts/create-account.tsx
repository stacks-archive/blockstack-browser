import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box, Flex, Text, Button } from '@stacks/ui';
import { useWallet } from '@common/hooks/use-wallet';

interface CreateAccountProps {
  close: () => void;
}

const TIMEOUT = 3000;

export const CreateAccount: React.FC<CreateAccountProps> = ({ close }) => {
  const { doCreateNewAccount } = useWallet();
  const [setting, setSetting] = useState(false);
  const timeout = useRef<number | null>(null);

  const createAccount = useCallback(async () => {
    if (!setting && !timeout.current) {
      setSetting(true);
      await doCreateNewAccount();
      timeout.current = setTimeout(() => close(), TIMEOUT);
      setSetting(false);
    }
  }, [doCreateNewAccount, setting, timeout, close]);

  useEffect(() => {
    void createAccount();
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [timeout, createAccount]);

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
