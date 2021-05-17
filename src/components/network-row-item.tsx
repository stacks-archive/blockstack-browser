import { color, Stack, StackProps } from '@stacks/ui';
import { Caption, Text } from '@components/typography';
import React from 'react';
import { useCurrentNetwork } from '@common/hooks/use-current-network';

export function NetworkRowItem(props: StackProps) {
  const { isTestnet } = useCurrentNetwork();
  return (
    <Stack
      alignItems="center"
      isInline
      spacing="4px"
      color={isTestnet ? color('feedback-alert') : color('text-caption')}
      _hover={
        props.onClick
          ? {
              cursor: 'pointer',
              opacity: 0.7,
            }
          : undefined
      }
      {...props}
    >
      {isTestnet && (
        <Text transform="translateY(1px)" display="block" fontSize="0.65rem" color="currentColor">
          ○
        </Text>
      )}
      <Caption color="currentColor">{isTestnet ? 'Testnet' : 'Mainnet'}</Caption>
    </Stack>
  );
}
