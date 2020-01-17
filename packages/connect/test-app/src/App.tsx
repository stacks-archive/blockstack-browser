import React from 'react';
import { useConnect } from '../../src/react';
import { Button, Flex } from '@blockstack/ui';

const DataVaultButton: React.FC = () => {
  const { doOpenDataVault } = useConnect();

  return <Button onClick={() => doOpenDataVault()}>Get Started</Button>;
};
const App: React.FC = () => {
  const { doOpenDataVault } = useConnect();

  return (
    <>
      <Flex
        align="center"
        justify="center"
        width="100vw"
        height="100vh"
        className="App"
        direction="column"
      >
        <DataVaultButton />
        <Flex onClick={() => doOpenDataVault(true)} mt={6}>
          Or sign in
        </Flex>
      </Flex>
    </>
  );
};

export default App;
