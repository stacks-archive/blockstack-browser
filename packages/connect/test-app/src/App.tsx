import React from 'react';
import { useConnect } from '../../src/react';
import { Button, Flex, Box } from '@blockstack/ui';

const AuthButton: React.FC = () => {
  const { doOpenAuth } = useConnect();

  return <Button onClick={() => doOpenAuth()}>Get Started</Button>;
};

const App: React.FC = () => {
  const { doOpenAuth } = useConnect();

  return (
    <Flex align="center" justify="center" width="100vw" minHeight="100vh" className="App" direction="column">
      <AuthButton />
      <Flex onClick={() => doOpenAuth(true)} mt={6}>
        Or sign in
      </Flex>
    </Flex>
  );
};

export default App;
