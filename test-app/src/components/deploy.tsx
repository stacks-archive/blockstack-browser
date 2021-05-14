import React from 'react';
import { useConnect } from '@stacks/connect-react';
import { SampleContracts } from '@common/contracts';
import { Box, Button, Text } from '@stacks/ui';
import { ExplorerLink } from './explorer-link';

export const Deploy = () => {
  const [tx, setTx] = React.useState('');
  const { doContractDeploy, userSession } = useConnect();
  const handleSubmit = () =>
    doContractDeploy({
      codeBody: SampleContracts[0].contractSource,
      contractName: SampleContracts[0].contractName,
      userSession,
      onFinish: data => {
        setTx(data.txId);
        console.log('finished!', data);
      },
    });
  return (
    <Box mb={6} maxWidth="600px" mt={6}>
      <Text as="h2" fontSize={5} mt={6}>
        Contract Deploy
      </Text>
      <Text display="block" my={4} textStyle="caption.medium">
        Deploy a Clarity smart contract. To keep things simple, we'll provide a contract for you.
      </Text>
      {tx && <ExplorerLink txId={tx} />}
      <Box mt={4}>
        <Button onClick={handleSubmit}>Deploy</Button>
      </Box>
    </Box>
  );
};
