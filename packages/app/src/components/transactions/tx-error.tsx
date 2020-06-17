import React from 'react';
import { Screen, ScreenBody, ScreenActions } from '@blockstack/connect';
import { Button, Text, Box, Flex, FailedIcon } from '@blockstack/ui';
import { TestnetBanner } from './testnet-banner';

interface TxErrorProps {
  message: string;
}

export const TxError: React.FC<TxErrorProps> = ({ message }) => {
  return (
    <>
      <Screen>
        {/* TODO: only show testnet banner if in testnet mode */}
        <TestnetBanner />
        <ScreenBody
          mt={6}
          body={[
            <Box textAlign="center">
              <Flex>
                <Box mx="auto" width="25%">
                  <FailedIcon size={64} width={64} maxWidth="100%" />
                </Box>
              </Flex>
              <Text display="block" textStyle="display.large" mb={3}>
                Transaction Failed
              </Text>
              <Text display="block" mb={6}>
                {message}
              </Text>
            </Box>,
          ]}
        />
        <ScreenActions>
          <Button
            width="100%"
            mt={6}
            size="lg"
            onClick={() => {
              window.close();
            }}
          >
            Return to App
          </Button>
        </ScreenActions>
      </Screen>
    </>
  );
};
