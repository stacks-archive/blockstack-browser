import React from 'react';
import { Stack, StackProps, Text } from '@stacks/ui';
import { AssetAvatar } from '@components/stx-avatar';

export const AssetItem: React.FC<
  StackProps & {
    iconString: string;
    amount: string | number;
    ticker: string;
  }
> = ({ iconString, amount, ticker, ...rest }) => {
  return (
    <Stack isInline alignItems="center" flexGrow={1} width="100%" {...rest}>
      <AssetAvatar size="32px" useStx={iconString === 'STX'} gradientString={iconString} />
      <Text fontWeight="500" fontSize={4}>
        {ticker}
      </Text>
      <Text fontWeight="500" fontSize={4} ml="auto">
        {amount}
      </Text>
    </Stack>
  );
};
