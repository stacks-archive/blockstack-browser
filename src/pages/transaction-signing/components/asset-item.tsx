import React from 'react';
import { Stack, StackProps, Text } from '@stacks/ui';
import { AssetAvatar } from '@components/stx-avatar';
import { SpaceBetween } from '@components/space-between';

export const AssetItem: React.FC<
  StackProps & {
    iconString: string;
    amount: string | number;
    ticker: string;
  }
> = ({ iconString, amount, ticker, ...rest }) => {
  return (
    <SpaceBetween alignItems="center" flexGrow={1} width="100%" {...rest}>
      <Stack isInline>
        <AssetAvatar size="32px" useStx={iconString === 'STX'} gradientString={iconString} />
        <Text fontWeight="500" fontSize={4}>
          {ticker}
        </Text>
      </Stack>
      <Text fontWeight="500" fontSize={4}>
        {amount}
      </Text>
    </SpaceBetween>
  );
};
