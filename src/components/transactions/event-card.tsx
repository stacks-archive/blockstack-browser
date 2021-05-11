import React from 'react';
import { Box, color, IconButton, Stack, Text } from '@stacks/ui';
import { SpaceBetween } from '@components/space-between';
import { IconDots } from '@tabler/icons';
import { Caption } from '@components/typography';
import { AssetItem } from '@components/transactions/asset-item';

export const TransactionEventCard: React.FC<any> = ({
  title,
  left,
  right,
  amount,
  ticker,
  icon,
  message,
  actions,
  isLast,
}) => {
  return (
    <>
      <Stack spacing="base-loose" p="base-loose">
        <SpaceBetween position="relative">
          <Text fontWeight={500} fontSize={2}>
            {title}
          </Text>
          {actions && <IconButton size="24px" icon={IconDots} position="absolute" right={0} />}
        </SpaceBetween>
        <AssetItem iconString={icon} amount={amount} ticker={ticker} />
        {left || right ? (
          <SpaceBetween>
            {left ? <Caption>{left}</Caption> : <Box />}
            {right && <Caption>{right}</Caption>}
          </SpaceBetween>
        ) : null}
      </Stack>
      {message && (
        <Box
          p="base-loose"
          borderTop="1px solid"
          borderColor={color('border')}
          borderBottom={!isLast ? '4px solid' : 'unset'}
          borderBottomColor={color('border')}
        >
          <Caption>{message}</Caption>
        </Box>
      )}
    </>
  );
};
