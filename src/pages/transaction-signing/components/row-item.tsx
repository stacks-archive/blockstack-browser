import { BoxProps, Stack, StackProps, Text } from '@stacks/ui';
import { SpaceBetween } from '@components/space-between';
import { Caption } from '@components/typography';
import React from 'react';
import { Link } from '@components/link';
import { useCurrentNetwork } from '@common/hooks/use-current-network';

function PrincipalValue({ address, ...rest }: { address: string } & BoxProps) {
  const { mode } = useCurrentNetwork();
  const url = `https://explorer.stacks.co/address/${address}?chain=${mode}`;
  return (
    <Link
      fontSize={2}
      fontWeight={500}
      lineHeight="1.6"
      wordBreak="break-all"
      onClick={() => window.open(url, '_blank')}
      {...rest}
    >
      {address}
    </Link>
  );
}

export function RowItem({
  name,
  type,
  value,
  ...rest
}: { name?: string | JSX.Element | null; type?: string; value: string } & StackProps) {
  return (
    <Stack spacing="base-tight" {...rest}>
      <SpaceBetween flexShrink={0}>
        {name && <Caption>{name}</Caption>}
        {type && <Caption>{type}</Caption>}
      </SpaceBetween>

      {type?.toLowerCase() === 'principal' ? (
        <PrincipalValue address={value} />
      ) : (
        <Text display="block" fontSize={2} fontWeight={500} lineHeight="1.6" wordBreak="break-all">
          {value}
        </Text>
      )}
    </Stack>
  );
}
