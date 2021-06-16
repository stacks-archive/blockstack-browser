import React, { memo, useMemo } from 'react';
import { Box, Stack, SlideFade, Flex, Spinner, color } from '@stacks/ui';
import type { StackProps } from '@stacks/ui';
import { TokenAssets } from '@components/popup/token-assets';

import { Caption } from '@components/typography';
import { NoActivityIllustration } from '@components/vector/no-activity';
import { Tabs } from '@components/tabs';

import { useAccountActivity } from '@common/hooks/account/use-account-activity';
import { useHomeTabs } from '@common/hooks/use-home-tabs';
import { createTxDateFormatList } from '@common/group-txs-by-date';
import { TransactionList } from './transaction-list';

function EmptyActivity() {
  return (
    <Stack py="extra-loose" spacing="extra-loose" justifyContent="center" alignItems="center">
      <Box mx="auto">
        <NoActivityIllustration />
      </Box>

      <Caption maxWidth="23ch" textAlign="center">
        No activity yet.
      </Caption>
    </Stack>
  );
}

const ActivityList = memo(() => {
  const transactions = useAccountActivity();
  const groupedTxs = useMemo(
    () => (transactions ? createTxDateFormatList(transactions) : []),
    [transactions]
  );
  return !transactions || transactions.length === 0 ? (
    <EmptyActivity />
  ) : (
    <TransactionList txsByDate={groupedTxs} />
  );
});

const Loading = memo(() => (
  <Flex width="100%" alignItems="center" justifyContent="center" flexGrow={1}>
    <Spinner color={color('text-caption')} />
  </Flex>
));

export function BalancesAndActivity(props: StackProps) {
  const { activeTab, setActiveTab } = useHomeTabs();
  return (
    <Stack flexGrow={1} spacing="extra-loose" {...props}>
      <Tabs
        tabs={[
          { slug: 'balances', label: 'Balances' },
          { slug: 'activity', label: 'Activity' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />

      <Flex position="relative" flexGrow={1}>
        <React.Suspense fallback={<Loading />}>
          <SlideFade in={activeTab === 0}>
            {styles => (
              <TokenAssets position="absolute" top={0} left={0} width="100%" style={styles} />
            )}
          </SlideFade>
          <SlideFade in={activeTab === 1}>
            {styles => (
              <Box position="absolute" top={0} left={0} width="100%" style={styles}>
                <ActivityList />
              </Box>
            )}
          </SlideFade>
        </React.Suspense>
      </Flex>
    </Stack>
  );
}
