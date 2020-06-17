import React, { useState } from 'react';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { getRPCClient } from '@common/utils';
import { ExplorerLink } from './explorer-link';

interface FaucetResponse {
  txId?: string;
  success: boolean;
}

export const Faucet = ({ address: _address = '' }: { address: string }) => {
  const [address, setAddress] = useState(_address);
  const [tx, setTX] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const client = getRPCClient();

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  const getServerURL = () => {
    const { origin } = location;
    if (origin.includes('localhost')) {
      return 'http://localhost:3999';
    }
    return 'https://sidecar.staging.blockstack.xyz';
  };

  const waitForBalance = async (currentBalance: number, attempts: number) => {
    const { balance } = await client.fetchAccount(address);
    if (attempts > 18) {
      setError(
        "It looks like your transaction still isn't confirmed after a few minutes. Something may have gone wrong."
      );
      setLoading(false);
    }
    if (balance.toNumber() > currentBalance) {
      setLoading(false);
      setSuccess(true);
      return;
    }
    setTimeout(() => {
      waitForBalance(currentBalance, attempts + 1);
    }, 10000);
  };

  const onSubmit = async () => {
    setLoading(true);
    setError('');
    setTX('');

    try {
      const url = `${getServerURL()}/sidecar/v1/debug/faucet?address=${address}`;
      const res = await fetch(url, {
        method: 'POST',
      });
      const data: FaucetResponse = await res.json();
      console.log(data);
      if (data.txId) {
        setTX(data.txId);
        const { balance } = await client.fetchAccount(address);
        await waitForBalance(balance.toNumber(), 0);
      } else {
        setError('Something went wrong when requesting the faucet.');
      }
    } catch (e) {
      setError('Something went wrong when requesting the faucet.');
      setLoading(false);
      setTX('');
      console.error(e.message);
    }
  };

  return (
    <Box mb={6} maxWidth="600px" mt={6}>
      <Text as="h2" fontSize={5} mt={6}>
        Faucet
      </Text>
      <Text display="block" my={4} textStyle="caption.medium">
        Receive some free testnet STX for testing out the network. STX are required to execute smart
        contract functions.
      </Text>
      {tx && <ExplorerLink txId={tx} />}
      {error && (
        <Text display="inline-block" my={1} fontSize={1} color="red">
          {error}
        </Text>
      )}
      <Flex wrap="wrap">
        <Box width="100%">
          <Input
            type="text"
            placeholder="Address"
            textStyle="body.small"
            value={address}
            onChange={handleInput}
            name="address"
          />
        </Box>
        <Box width="100%" mt={3}>
          <Button
            isLoading={loading}
            loadingText=" Waiting for TX to Confirm"
            isDisabled={success}
            onClick={onSubmit}
          >
            {success ? 'Faucet TX Confirmed' : 'Receive Testnet STX'}
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};
