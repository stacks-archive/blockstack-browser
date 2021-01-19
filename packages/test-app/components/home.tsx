import React, { useContext, useState } from 'react';
import { AppContext } from '@common/context';
import { Box, Text, Flex, space, BoxProps } from '@blockstack/ui';
import { Auth } from './auth';
import { Tab } from './tab';
import { Status } from './status';
import { Counter } from './counter';
import { Debugger } from './debugger';
import { useFaucet } from '@common/use-faucet';
import { ExplorerLink } from './explorer-link';

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

export const Home: React.FC = () => {
  const state = useContext(AppContext);
  const [tab, setTab] = useState<Tabs>('debug');
  const faucet = useFaucet();

  const Page: React.FC = () => {
    return (
      <>
        <Container borderColor="#F0F0F5" borderWidth={0} borderBottomWidth="1px">
          <Box>
            {faucet.txId ? (
              <>
                <Text textStyle="body.large" display="block">
                  We've requested some testnet STX from the faucet for you.
                </Text>
                <ExplorerLink txId={faucet.txId} />
              </>
            ) : null}
          </Box>
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
  return (
    <Flex flexWrap="wrap">
      <Container mt={space('base-loose')}>
        <Text as="h1" textStyle="display.large" fontSize={7} mb={space('loose')} display="block">
          Testnet Demo
        </Text>
      </Container>
      {state.userData ? (
        <Page />
      ) : (
        <Container>
          <Auth />
        </Container>
      )}
    </Flex>
  );
};
