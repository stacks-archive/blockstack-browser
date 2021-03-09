import React from 'react';
import { Button, ButtonGroup, Box, Text } from '@blockstack/ui';
import { AppContext } from '@common/context';
import { getAuthOrigin, getRPCClient, stacksNetwork as network } from '@common/utils';
import { deserializeCV, IntCV } from '@blockstack/stacks-transactions';
import { useConnect } from '@stacks/connect-react';
import { ExplorerLink } from '@components/explorer-link';

export const CounterActions: React.FC = () => {
  const { userData } = React.useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [txId, setTxId] = React.useState('');
  const [counter, setCounter] = React.useState<number | null>(null);
  const [error, setError] = React.useState('');
  const { doContractCall } = useConnect();

  const callMethod = async (method: string) => {
    setError('');
    setLoading(true);
    const authOrigin = getAuthOrigin();
    await doContractCall({
      authOrigin,
      network,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      functionName: method,
      functionArgs: [],
      contractName: 'counter',
      finished: data => {
        setTxId(data.txId);
        console.log('finished!', data);
        setLoading(false);
      },
    });
  };

  const getCounter = async () => {
    const client = getRPCClient();
    setLoading(true);
    setError('');
    try {
      const data = await client.callReadOnly({
        contractName: 'counter',
        contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
        args: [],
        functionName: 'get-counter',
      });
      const cv = deserializeCV(Buffer.from(data.result.slice(2), 'hex')) as IntCV;
      console.log(cv.value);
      setCounter(cv.value.toNumber());
      setLoading(false);
    } catch (error) {
      setError('Unable to get current counter value.');
    }
  };

  return (
    <Box>
      {!userData && <Text display="block">Log in to change the state of this smart contract.</Text>}
      <ButtonGroup spacing={4} my={5}>
        <Button mt={3} onClick={() => callMethod('increment')}>
          Increase by 1
        </Button>
        <Button mt={3} onClick={() => callMethod('decrement')}>
          Decrease by 1
        </Button>
        <Button mt={3} onClick={getCounter}>
          Get current value
        </Button>
      </ButtonGroup>
      {error && (
        <Text display="block" color="red">
          {error}
        </Text>
      )}
      {txId && !loading && <ExplorerLink txId={txId} />}
      {counter !== null && !loading && (
        <Text display="block">Current counter value: {counter}</Text>
      )}
    </Box>
  );
};
