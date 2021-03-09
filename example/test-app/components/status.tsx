import React, { useState, useEffect } from 'react';
import { space, Box, Text, Button, Input, Flex } from '@blockstack/ui';
import { ExplorerLink } from './explorer-link';
import { useConnect } from '@stacks/connect-react';
import {
  PostConditionMode,
  standardPrincipalCV,
  BufferCV,
  deserializeCV,
  ClarityType,
  bufferCV,
} from '@blockstack/stacks-transactions';
import { getAuthOrigin, getRPCClient, stacksNetwork as network } from '@common/utils';
import { ContractCallTransaction } from '@blockstack/stacks-blockchain-sidecar-types';
import { TxCard } from '@components/tx-card';
import { useSTXAddress } from '@common/use-stx-address';

export const Status = () => {
  const stxAddress = useSTXAddress();
  const [status, setStatus] = useState('');
  const [readStatus, setReadStatus] = useState('');
  const [address, setAddress] = useState('');
  const [txId, setTxId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState<ContractCallTransaction[]>([]);
  const { doContractCall } = useConnect();

  const client = getRPCClient();

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const transactions = await client.fetchAddressTransactions({
          address: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.status',
        });
        const filtered = transactions.filter(t => {
          return t.tx_type === 'contract_call';
        });
        setTransactions(filtered as ContractCallTransaction[]);
      } catch (error) {
        console.error('Unable to get recent transactions for status contract');
      }
    };
    void getTransactions();
  }, []);

  const getAddressCV = () => {
    try {
      return standardPrincipalCV(address);
    } catch (error) {
      setError('Invalid address.');
      return null;
    }
  };

  const onSubmitRead = async () => {
    const addressCV = getAddressCV();
    if (!addressCV) {
      return;
    }
    const args = [addressCV];
    setLoading(true);
    try {
      const data = await client.callReadOnly({
        contractName: 'status',
        contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
        args,
        functionName: 'get-status',
      });
      console.log(data);
      const cv = deserializeCV(Buffer.from(data.result.slice(2), 'hex')) as BufferCV;
      console.log(cv);
      if (cv.type === ClarityType.Buffer) {
        const ua = Array.from(cv.buffer);
        const str = String.fromCharCode.apply(null, ua);
        setReadStatus(str);
        console.log(str);
      }
    } catch (error) {
      setError('An error occurred while fetching the status contract.');
    }
    setLoading(false);
  };

  const onSubmitWrite = async () => {
    const authOrigin = getAuthOrigin();
    const statusArg = bufferCV(Buffer.from(status));
    await doContractCall({
      authOrigin,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      functionName: 'write-status!',
      network,
      functionArgs: [statusArg],
      contractName: 'status',
      finished: data => {
        setTxId(data.txId);
        console.log('finished!', data);
      },
      postConditionMode: PostConditionMode.Deny,
    });
  };

  const handleStatus = (evt: React.FormEvent<HTMLInputElement>) => {
    setStatus(evt.currentTarget.value || '');
  };

  const handleAddress = (evt: React.FormEvent<HTMLInputElement>) => {
    setAddress(evt.currentTarget.value || '');
  };

  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Status smart contract
      </Text>
      <Text textStyle="body.large" display="block" my={space('loose')}>
        Try a smart contract where anyone can write their public status, like a decentralized
        Twitter. You can read someone else's status by entering their address.
      </Text>
      <ExplorerLink
        txId="STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6.status"
        text="View contract in explorer"
        skipConfirmCheck
      />

      {transactions.length > 0 && (
        <>
          <Text display="block" my={space('base-loose')} textStyle="body.large.medium">
            Latest statuses
          </Text>
          <Flex flexWrap="wrap" justifyContent="left">
            {transactions.slice(0, 3).map(t => (
              <TxCard tx={t} label={JSON.parse(t.tx_result?.repr || '')} />
            ))}
          </Flex>
        </>
      )}

      <Text display="block" my={space('base-loose')} textStyle="body.large.medium">
        Write a status
      </Text>

      <Box width="100%" mt={3}>
        <Input
          type="text"
          placeholder="Enter your status"
          textStyle="body.small"
          value={status}
          onChange={handleStatus}
          name="status"
          maxWidth="300px"
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'enter') {
              void onSubmitWrite();
            }
          }}
        />
      </Box>
      {txId && <ExplorerLink txId={txId} />}
      <Button my={space('base-loose')} onClick={onSubmitWrite}>
        Write status
      </Button>

      <Text display="block" my={space('base-loose')} textStyle="body.large.medium">
        Read a status
      </Text>

      {stxAddress && (
        <Text display="block" my={space('base-loose')} textStyle="body.small">
          If you want to read your own status, your address is {stxAddress}.
        </Text>
      )}

      <Box width="100%" mt={3}>
        <Input
          type="text"
          placeholder="Enter an STX address"
          textStyle="body.small"
          value={address}
          onChange={handleAddress}
          name="status"
          maxWidth="300px"
          onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'enter') {
              void onSubmitRead();
            }
          }}
        />
      </Box>

      {readStatus && (
        <Text display="block" fontWeight={600} my={3} width="100%">
          {readStatus}
        </Text>
      )}

      {error && (
        <Text display="block" color="red" width="100%" fontSize={1} mt={2}>
          {error}
        </Text>
      )}
      <Button my={space('base-loose')} onClick={onSubmitRead} isLoading={loading}>
        Read status
      </Button>
    </Box>
  );
};
