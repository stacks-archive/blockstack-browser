import { useTxState } from '@common/hooks/use-tx-state';
import { Text, Stack } from '@stacks/ui';
import React from 'react';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';

export const NonceRow: React.FC = props => {
  const { signedTransaction } = useTxState();
  return (
    <SpaceBetween spacing="base-loose" {...props}>
      <Stack flexShrink={0}>
        <Text display="block" fontSize={2} fontWeight={500}>
          nonce
        </Text>

        <Caption>uint</Caption>
      </Stack>

      {signedTransaction.value ? (
        <Caption lineHeight="1.6" wordBreak="break-all">
          {signedTransaction.value.auth.spendingCondition?.nonce.toNumber()}
        </Caption>
      ) : null}
    </SpaceBetween>
  );
};
