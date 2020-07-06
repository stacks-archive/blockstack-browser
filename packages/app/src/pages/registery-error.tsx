import React from 'react';
import { Screen, ScreenBody, PoweredBy, ScreenFooter } from '@blockstack/connect';
import { Flex, Box, Button, Text } from '@blockstack/ui';
import { ScreenHeader } from '@components/connected-screen-header';

export type ErrorReason = 'network' | 'rateLimited';

interface RegisterErrorProps {
  errorReason: ErrorReason;
  onTryAgain: () => void;
}

export const UsernameRegistryError: React.FC<RegisterErrorProps> = ({
  errorReason,
  onTryAgain,
}) => {
  const getMessage = () => {
    if (errorReason === 'rateLimited') {
      return 'You’ve tried to register too many usernames on this network. Please try again on a different network.';
    }
    return 'A network error was encountered.';
  };
  return (
    <Screen textAlign="center">
      <ScreenHeader />
      <ScreenBody
        flex="5"
        justifyContent="center"
        body={[
          <Flex flexDirection="column" mx={4}>
            <Box>
              <Text fontWeight="600" fontSize={3} display="block">
                Your username couldn't be registered
              </Text>
              <Text fontSize={2} display="block" mt={3}>
                {getMessage()}
              </Text>
              <Button mt={6} onClick={() => onTryAgain()}>
                Try Again
              </Button>
            </Box>
          </Flex>,
        ]}
      />
      <ScreenFooter>
        <PoweredBy />
      </ScreenFooter>
    </Screen>
  );
};
