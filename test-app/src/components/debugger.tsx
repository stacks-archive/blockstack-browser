import React, { useState } from 'react';
import { Box, Text, Button, ButtonGroup } from '@stacks/ui';
import { stacksNetwork as network } from '@common/utils';
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
  makeStandardFungiblePostCondition,
  createAssetInfo,
  FungibleConditionCode,
  bufferCVFromString,
  noneCV,
  createNonFungiblePostCondition,
  NonFungibleConditionCode,
  tupleCV,
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

  const callBnsTransfer = async () => {
    // this will fail because the address does not own the name
    clearState();
    const args = [
      bufferCVFromString('id'), // namespace
      bufferCVFromString('stella'), // name
      standardPrincipalCV('STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6'), // recipient
      noneCV(), // zonefile
    ];
    await doContractCall({
      network,
      contractAddress: 'ST000000000000000000002AMW42H',
      contractName: 'bns',
      functionName: 'name-transfer',
      functionArgs: args,
      attachment: 'This is an attachment',
      postConditions: [
        createNonFungiblePostCondition(
          address || '', // the sender
          NonFungibleConditionCode.DoesNotOwn, // will not own this NFT anymore
          createAssetInfo('ST000000000000000000002AMW42H', 'bns', 'names'), // bns NFT
          tupleCV({
            name: bufferCVFromString('stella'),
            namespace: bufferCVFromString('id'),
          }) // the name
        ),
      ],
      onFinish: data => {
        console.log('finished bns call!', data);
        setState('Contract Call', data.txId);
      },
    });
  };

  const callFaker = async () => {
    clearState();
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
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      contractName: 'faker',
      functionName: 'rawr',
      functionArgs: args,
      attachment: 'This is an attachment',
      postConditions: [
        makeStandardSTXPostCondition(
          address || '',
          FungibleConditionCode.LessEqual,
          new BN('100', 10)
        ),
        makeStandardFungiblePostCondition(
          'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
          FungibleConditionCode.Equal,
          new BN(1234),
          createAssetInfo(
            'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
            'connect-token',
            'connect-token'
          )
        ),
      ],
      onFinish: data => {
        console.log('finished faker!', data);
        console.log(data.stacksTransaction.auth.spendingCondition?.nonce.toNumber());
        setState('Contract Call', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const stxTransfer = async (amount: string) => {
    clearState();
    await doSTXTransfer({
      network,
      amount,
      memo: 'From demo app',
      recipient: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      onFinish: data => {
        console.log('finished stx transfer!', data);
        setState('Stacks Transfer', data?.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const deployContract = async () => {
    clearState();
    await doContractDeploy({
      network,
      contractName: `demo-deploy-${new Date().getTime().toString()}`,
      codeBody: demoTokenContract,
      onFinish: data => {
        console.log('finished stx transfer!', data);
        setState('Contract Deploy', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const callNullContract = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      contractName: `connect-token-${new Date().getTime()}`,
      functionName: 'faucet',
      functionArgs: [],
    });
  };

  const getFaucetTokens = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'STB44HYPYAT2BB2QE513NSP81HTMYWBJP02HPGK6',
      contractName: 'connect-token',
      functionName: 'faucet',
      functionArgs: [],
      onFinish: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const getRocketTokens = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'ST33GW755MQQP6FZ58S423JJ23GBKK5ZKH3MGR55N',
      contractName: 'rocket-token',
      functionName: 'buy',
      functionArgs: [uintCV(42)],
      postConditions: [
        makeStandardSTXPostCondition(
          address || '',
          FungibleConditionCode.Equal,
          new BN(42000000, 10)
        ),
      ],
      onFinish: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  const getStellaFaucetTokens = async () => {
    clearState();
    await doContractCall({
      network,
      contractAddress: 'ST1X6M947Z7E58CNE0H8YJVJTVKS9VW0PHEG3NHN3',
      contractName: 'stella-final',
      functionName: 'faucet',
      functionArgs: [],
      onFinish: data => {
        console.log('finished faucet!', data);
        setState('Token Faucet', data.txId);
      },
      onCancel: () => {
        console.log('popup closed!');
      },
    });
  };

  return (
    <Box py={6}>
      <Text as="h2" textStyle="display.small">
        Debugger
      </Text>
      <Text textStyle="body.large" display="block" my={'base'}>
        Try out a bunch of different transactions on the Stacks blockchain testnet.
      </Text>
      {txId && (
        <Text textStyle="body.large" display="block" my={'base'}>
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
          <Button mt={3} onClick={callBnsTransfer}>
            NFT with postconditions (will fail)
          </Button>
          <Button mt={3} onClick={deployContract}>
            Contract deploy
          </Button>
          <Button mt={3} onClick={getStellaFaucetTokens}>
            Get SteLLa tokens (sip 10 with memo)
          </Button>
          <Button mt={3} onClick={getRocketTokens}>
            Get Rocket tokens (old sip 10 no memo)
          </Button>
          <Button mt={3} onClick={getFaucetTokens}>
            Get connect tokens
          </Button>
          <Button mt={3} onClick={callNullContract}>
            Non-existent contract
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
