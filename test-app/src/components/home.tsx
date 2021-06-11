import React, { useContext, useState } from 'react';
import { AppContext } from '@common/context';
import { Box, Text, Flex, BoxProps } from '@stacks/ui';
import { Auth } from './auth';
import { Tab } from './tab';
import { Status } from './status';
import { Counter } from './counter';
import { Debugger } from './debugger';

type Tabs = 'status' | 'counter' | 'debug';

const Container: React.FC<BoxProps> = ({ children, ...props }) => {
  return (
    <Box width="100%" px={6} {...props}>
      <Box maxWidth="900px" mx="auto">
        {children}
      </Box>
    </Box>
  );
};

const Page: React.FC<{ tab: Tabs; setTab: (value: Tabs) => void }> = ({ tab, setTab }) => {
  return (
    <>
      <Container borderColor="#F0F0F5" borderWidth={0} borderBottomWidth="1px">
        <Flex>
          <Tab active={tab === 'debug'}>
            <Text onClick={() => setTab('debug')}>Dubugger</Text>
          </Tab>
          <Tab active={tab === 'status'}>
            <Text onClick={() => setTab('status')}>Status smart contract</Text>
          </Tab>
          <Tab active={tab === 'counter'}>
            <Text onClick={() => setTab('counter')}>Counter smart contract</Text>
          </Tab>
        </Flex>
      </Container>
      <Container>
        {tab === 'status' && <Status />}
        {tab === 'counter' && <Counter />}
        {tab === 'debug' && <Debugger />}
      </Container>
    </>
  );
};

export const Home: React.FC = () => {
  const state = useContext(AppContext);
  const [tab, setTab] = useState<Tabs>('debug');

  return (
    <Container>
      <Text as="h1" textStyle="display.large" fontSize={7} mb={'loose'} display="block">
        Testnet Demo
      </Text>
      {state.userData ? <Page tab={tab} setTab={setTab} /> : <Auth />}
    </Container>
  );
};
