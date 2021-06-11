import React from 'react';
import { Box, Text } from '@stacks/ui';
import { ExplorerLink } from './explorer-link';
import { CounterActions } from './counter-actions';

export const Counter = () => {
  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Counter smart contract
      </Text>
      <Text textStyle="body.large" display="block" my={'loose'}>
        Try a smart contract that keeps a single "counter" state variable. The public methods
        "increment" and "decrement" change the value of the counter.
      </Text>
      <ExplorerLink
        txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.counter"
        text="View contract in explorer"
        skipConfirmCheck
      />
      <CounterActions />
    </Box>
  );
};
