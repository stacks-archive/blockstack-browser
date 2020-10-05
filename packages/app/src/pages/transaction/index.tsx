import React, { useState, useEffect } from 'react';
import {
  Screen,
  ScreenBody,
  ScreenActions,
  Title,
  PoweredBy,
  ScreenFooter,
  TransactionPayload,
  TransactionTypes,
} from '@blockstack/connect';
import { ScreenHeader } from '@components/connected-screen-header';
import { Button, Box, Text } from '@blockstack/ui';
import { useLocation } from 'react-router-dom';
import { decodeToken } from 'jsontokens';
import { useWallet } from '@common/hooks/use-wallet';
import {
  TransactionVersion,
  StacksTransaction,
  StacksMainnet,
  StacksTestnet,
} from '@blockstack/stacks-transactions';
import { TestnetBanner } from '@components/transactions/testnet-banner';
import { TxError } from '@components/transactions/tx-error';
import { TabbedCard, Tab } from '@components/tabbed-card';
import { getRPCClient, stacksValue } from '@common/stacks-utils';
import { Wallet } from '@blockstack/keychain';
import { doTrack, TRANSACTION_SIGN_START, TRANSACTION_SIGN_ERROR } from '@common/track';
import { finishTransaction, generateTransaction } from '@common/transaction-utils';

interface TabContentProps {
  json: any;
}

const getInputJSON = (pendingTransaction: TransactionPayload | undefined, wallet: Wallet) => {
  if (pendingTransaction && wallet) {
    const { appDetails, publicKey, ...rest } = pendingTransaction;
    return {
      ...rest,
      'tx-sender': wallet.getSigner().getSTXAddress(TransactionVersion.Testnet),
    };
  }
  return {};
};

const TabContent: React.FC<TabContentProps> = ({ json }) => {
  return (
    <Box whiteSpace="pre" overflow="scroll" color="gray" maxHeight="200px">
      {JSON.stringify(json, null, 2)}
    </Box>
  );
};

export const Transaction: React.FC = () => {
  const location = useLocation();
  const { wallet } = useWallet();
  const [pendingTransaction, setPendingTransaction] = useState<TransactionPayload | undefined>();
  const [signedTransaction, setSignedTransaction] = useState<StacksTransaction | undefined>();
  const [loading, setLoading] = useState(true);
  const [contractSrc, setContractSrc] = useState('');
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const client = getRPCClient();

  if (!wallet) {
    throw new Error('User must be logged in.');
  }

  const tabs: Tab[] = [
    {
      title: 'Inputs',
      content: <TabContent json={getInputJSON(pendingTransaction, wallet)} />,
      key: 'inputs',
    },
    {
      title: (
        <>
          View Source
          {/* Add this icon when we can link to the explorer */}
          {/* <ExternalIcon display="inline-block" width="9px" ml={1} /> */}
        </>
      ),
      content: (
        <Box whiteSpace="pre" overflow="scroll" color="gray" maxHeight="200px">
          {contractSrc}
        </Box>
      ),
      key: 'source',
      hide: pendingTransaction?.txType === TransactionTypes.STXTransfer,
    },
  ];

  const setupAccountInfo = async () => {
    const account = await wallet.getSigner().fetchAccount({
      version: TransactionVersion.Testnet,
      rpcClient: client,
    });
    setBalance(account.balance.toNumber());
    return account;
  };

  const setupWithState = async (tx: TransactionPayload) => {
    if (tx.network) {
      let network =
        tx.network.version == TransactionVersion.Mainnet
          ? new StacksMainnet()
          : new StacksTestnet();
      tx.network = { ...network, ...tx.network };
    }
    if (tx.txType === TransactionTypes.ContractCall) {
      const contractSource = await client.fetchContractSource({
        contractName: tx.contractName,
        contractAddress: tx.contractAddress,
      });
      if (contractSource) {
        setContractSrc(contractSource);
        setPendingTransaction(tx);
      } else {
        doTrack(TRANSACTION_SIGN_ERROR, {
          txType: pendingTransaction?.txType,
          appName: pendingTransaction?.appDetails?.name,
          error: 'Contract not found',
        });
        setError(`Unable to find contract ${tx.contractAddress}.${tx.contractName}`);
      }
    } else if (tx.txType === TransactionTypes.ContractDeploy) {
      console.log(tx);
      setContractSrc(tx.codeBody);
      setPendingTransaction(tx);
    } else if (tx.txType === TransactionTypes.STXTransfer) {
      setPendingTransaction(tx);
    }
    doTrack(TRANSACTION_SIGN_START, {
      txType: tx.txType,
      appName: tx.appDetails?.name,
    });
    return tx;
  };

  const decodeRequest = async () => {
    const urlParams = new URLSearchParams(location.search);
    const requestToken = urlParams.get('request');
    if (requestToken) {
      const token = decodeToken(requestToken);
      const reqState = (token.payload as unknown) as TransactionPayload;
      try {
        const [txData, account] = await Promise.all([setupWithState(reqState), setupAccountInfo()]);
        const tx = await generateTransaction({
          wallet,
          nonce: account.nonce,
          txData,
        });
        setSignedTransaction(tx);
      } catch (error) {
        const nodeURL = new URL(client.url);
        setError(`Unable to connect to a Stacks node at ${nodeURL.hostname}`);
      }
      setLoading(false);
    } else {
      setError('Unable to decode request');
      console.error('Unable to find contract call parameter');
    }
  };

  useEffect(() => {
    if (wallet.stacksPrivateKey) {
      decodeRequest();
    }
  }, [wallet]);

  const handleButtonClick = async () => {
    if (!pendingTransaction || !signedTransaction) {
      // shouldn't be able to get here
      setError('Unable to finish transaction');
      return;
    }
    setLoading(true);
    try {
      await finishTransaction({ tx: signedTransaction, pendingTransaction });
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  if (error) {
    return <TxError message={error} />;
  }

  return (
    <>
      <Screen isLoading={loading}>
        {/* TODO: only show testnet banner if in testnet mode */}
        <TestnetBanner />
        <ScreenHeader
          rightContent={
            <Text textStyle="caption" color="gray" fontSize={0}>
              {stacksValue({ value: balance })} available
            </Text>
          }
        />
        <ScreenBody
          mt={6}
          body={[
            <Title>Confirm Transaction</Title>,
            <Text mt={2} display="inline-block">
              with {pendingTransaction?.appDetails?.name}
            </Text>,
            <TabbedCard mt={4} mb={4} tabs={tabs} />,
            <Box width="100%" mt={5}>
              <Text fontWeight={600}>
                <Text>Fee</Text>
                <Text style={{ float: 'right' }}>
                  {stacksValue({
                    value: signedTransaction?.auth.spendingCondition?.fee?.toNumber() || 0,
                  })}
                </Text>
              </Text>
            </Box>,
          ]}
        />
        <ScreenActions>
          <Button
            width="100%"
            mt={5}
            size="lg"
            onClick={async () => {
              await handleButtonClick();
            }}
          >
            Confirm Transaction
          </Button>
        </ScreenActions>
        <ScreenFooter>
          <PoweredBy />
        </ScreenFooter>
      </Screen>
    </>
  );
};
