import React, { useEffect, useState } from 'react';
import { space, Box, Text, Flex } from '@blockstack/ui';
import { ExplorerLink } from './explorer-link';
import { CounterActions } from './counter-actions';
import { getRPCClient } from '@common/utils';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { TxCard } from '@components/tx-card';

export const Counter = () => {
  const [transactions, setTransactions] = useState<ContractCallTransaction[]>([]);
  const client = getRPCClient();

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactions = await client.fetchAddressTransactions({
          address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.counter',
        });
        const filtered = transactions.filter(t => {
          return t.tx_type === 'contract_call';
        });
        setTransactions(filtered as ContractCallTransaction[]);
      } catch (error) {
        console.error('Unable to get recent transactions for counter contract');
      }
    };
    void getTransactions();
  }, []);
  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Counter smart contract
      </Text>
      <Text textStyle="body.large" display="block" my={space('loose')}>
        Try a smart contract that keeps a single "counter" state variable. The public methods
        "increment" and "decrement" change the value of the counter.
      </Text>
      <ExplorerLink
        txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.counter"
        text="View contract in explorer"
        skipConfirmCheck
      />

      {transactions.length > 0 && (
        <>
          <Text display="block" my={space('base-loose')} textStyle="body.large.medium">
            Latest changes
          </Text>
          <Flex flexWrap="wrap" justifyContent="left">
            {transactions.slice(0, 3).map(t => (
              <TxCard tx={t} label={t.contract_call.function_name === 'increment' ? '+1' : '-1'} />
            ))}
          </Flex>
        </>
      )}

      <CounterActions />
    </Box>
  );
};
