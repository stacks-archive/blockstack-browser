import React from 'react';
import { Box } from '@stacks/ui';
import { AssetList } from '@components/popup/asset-list';
import { useFetchAccountData } from '@common/hooks/use-account-info';
import { Flex } from '@stacks/ui';
import { TxItem } from './tx-item';
import { MempoolTransaction, Transaction } from '@blockstack/stacks-blockchain-api-types';
import { LoadingRectangle } from '@components/loading-rectangle';

const HomeLoading: React.FC = () => {
  return (
    <Flex flexDirection="column" mt="extra-loose">
      <Box width="100%">
        <LoadingRectangle width="60%" height="80px" />
      </Box>
      <Box width="100%" mt="loose" mb="extra-loose">
        <LoadingRectangle width="100%" height="120px" />
      </Box>
    </Flex>
  );
};

export const AccountInfo: React.FC = () => {
  const accountData = useFetchAccountData();
  if (accountData.state === 'loading' && !accountData.value) {
    return <HomeLoading />;
  }
  const data = accountData.value;
  if (!data) {
    return null;
  }
  const latestConfirmedTx = data.transactions.results[0];
  const latestPendingTx = data.pendingTransactions[0];
  const latestTx: MempoolTransaction | Transaction = latestPendingTx || latestConfirmedTx;
  return (
    <Flex flexWrap="wrap" flexDirection="column">
      <TxItem transaction={latestTx} />
      <AssetList balances={data.balances} />
    </Flex>
  );
};
