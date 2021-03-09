import React, { useState } from 'react';
import { space, Box, Text, Button, ButtonGroup } from '@blockstack/ui';
import { getAuthOrigin, stacksNetwork as network } from '@common/utils';
import { demoTokenContract } from '@common/contracts';
import { useSTXAddress } from '@common/use-stx-address';
import { useConnect } from '@stacks/connect-react';
import {
  uintCV,
  intCV,
  bufferCV,
  stringAsciiCV,
  stringUtf8CV,
  standardPrincipalCV,
  trueCV,
  makeStandardSTXPostCondition,
  FungibleConditionCode,
} from '@stacks/transactions';
import { ExplorerLink } from './explorer-link';
import BN from 'bn.js';

export const Debugger = () => {
  const { doContractCall, doSTXTransfer, doContractDeploy } = useConnect();
  const address = useSTXAddress();
  const [txId, setTxId] = useState<string>('');
  const [txType, setTxType] = useState<string>('');

  const clearState = () => {
    setTxId('');
    setTxType('');
  };

  const setState = (type: string, id: string) => {
    setTxId(id);
    setTxType(type);
  };

  const callFaker = async () => {
    clearState();
    const authOrigin = getAuthOrigin();
    const args = [
      uintCV(1234),
      intCV(-234),
      bufferCV(Buffer.from('hello, world')),
      stringAsciiCV('hey-ascii'),
      stringUtf8CV('hey-utf8'),
      standardPrincipalCV('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6'),
      trueCV(),
    ];
    await doContractCall({
      network,
      authOrigin,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      contractName: 'faker',
      functionName: 'rawr',
      functionArgs: args,
      postConditions: [
        makeStandardSTXPostCondition(
          address || '',
          FungibleConditionCode.LessEqual,
          new BN('100', 10)
        ),
      ],
      finished: data => {
        console.log('finished faker!', data);
        console.log(data.stacksTransaction.auth.spendingCondition?.nonce.toNumber());
        setState('Contract Call', data.txId);
      },
    });
  };

  const stxTransfer = async (amount: string) => {
    clearState();
    const authOrigin = getAuthOrigin();
    await doSTXTransfer({
      network,
      authOrigin,
      amount,
      memo: 'From demo app',
      recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      finished: data => {
        console.log('finished stx transfer!', data);
        setState('Stacks Transfer', data.txId);
      },
    });
  };

  const deployContract = async () => {
    clearState();
    const authOrigin = getAuthOrigin();
    await doContractDeploy({
      network,
      authOrigin,
      contractName: `demo-deploy-${new Date().getTime().toString()}`,
      codeBody: demoTokenContract,
      finished: data => {
        console.log('finished stx transfer!', data);
        setState('Contract Deploy', data.txId);
      },
    });
  };

  const callNullContract = async () => {
    clearState();
    const authOrigin = getAuthOrigin();
    await doContractCall({
      network,
      authOrigin,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      contractName: `connect-token-${new Date().getTime()}`,
      functionName: 'faucet',
      functionArgs: [],
    });
  };

  const getFaucetTokens = async () => {
    clearState();
    const authOrigin = getAuthOrigin();
    await doContractCall({
      network,
      authOrigin,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      contractName: 'connect-token',
      functionName: 'faucet',
      functionArgs: [],
      finished: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
    });
  };
  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Debugger
      </Text>
      <Text textStyle="body.large" display="block" my={space('base')}>
        Try out a bunch of different transactions on the Stacks blockchain testnet.
      </Text>
      {txId && (
        <Text textStyle="body.large" display="block" my={space('base')}>
          <Text color="green" fontSize={1}>
            Successfully broadcasted &quot;{txType}&quot;
          </Text>
          <ExplorerLink txId={txId} />
        </Text>
      )}

      <Box>
        <ButtonGroup spacing={4} my="base">
          <Button mt={3} onClick={callFaker}>
            Contract call
          </Button>
          <Button mt={3} onClick={() => stxTransfer('102')}>
            STX transfer
          </Button>
          {/* <Button mt={3} onClick={() => stxTransfer((1000000 * 1000000).toString())}>
            Big STX transfer
          </Button> */}
          <Button mt={3} onClick={deployContract}>
            Contract deploy
          </Button>
          <Button mt={3} onClick={getFaucetTokens}>
            Get tokens
          </Button>
          <Button mt={3} onClick={callNullContract}>
            Non-existent contract
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
