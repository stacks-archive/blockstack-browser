import React, { useState } from 'react';
import { Flex, Box, Button, Input, Text } from '@blockstack/ui';
import { useConnect } from '@blockstack/connect';
import { ExplorerLink } from '@components/explorer-link';
import { getAuthOrigin } from '@common/utils';

export const STXTransfer = () => {
  const [address, setAddress] = useState('');
  const [tx, setTX] = useState('');
  const [error, setError] = useState('');
  const { doSTXTransfer } = useConnect();

  const handleInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  const onSubmit = () => {
    setError('');
    setTX('');

    doSTXTransfer({
      recipient: address,
      amount: '100',
      memo: 'Testing STX Transfer',
      authOrigin: getAuthOrigin(),
      finished: data => {
        setTX(data.txId);
      },
    });
  };

  return (
    <Box mb={6} maxWidth="600px" mt={6}>
      <Text as="h2" fontSize={5} mt={6}>
        STX Transfer
      </Text>
      <Text display="block" my={4} textStyle="caption.medium">
        Send a small amount of STX to a different user.
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
          <Button onClick={onSubmit}>Submit</Button>
        </Box>
      </Flex>
    </Box>
  );
};
