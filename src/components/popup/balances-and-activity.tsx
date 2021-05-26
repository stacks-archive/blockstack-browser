import React from 'react';
import { Box, Stack, SlideFade } from '@stacks/ui';
import { TokenAssets } from '@components/popup/token-assets';

import type { StackProps } from '@stacks/ui';
import { Caption } from '@components/typography';
import { NoActivityIllustration } from '@components/vector/no-activity';
import { Tabs } from '@components/tabs';
import { useAccountActivity } from '@common/hooks/account/use-account-activity';
import { TxItem } from '@components/popup/tx-item';
import { useHomeTabs } from '@common/hooks/use-home-tabs';

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

function ActivityList() {
  const { isLoading, value: data } = useAccountActivity();
  if (isLoading) return null;
  return !data || data.length === 0 ? (
    <EmptyActivity />
  ) : (
    <Stack pb="extra-loose" spacing="extra-loose">
      {data.map(tx => (
        <TxItem transaction={tx} />
      ))}
    </Stack>
  );
}

export function BalancesAndActivity({ ...rest }: StackProps) {
  const { activeTab, setActiveTab } = useHomeTabs();
  return (
    <Stack flexGrow={1} spacing="extra-loose" {...rest}>
      <Tabs
        tabs={[
          { slug: 'balances', label: 'Balances' },
          { slug: 'activity', label: 'Activity' },
        ]}
        activeTab={activeTab}
        onTabClick={setActiveTab}
      />
      <Box position="relative" flexGrow={1}>
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
      </Box>
    </Stack>
  );
}
