import { color, DynamicColorCircle, Stack, StackProps } from '@stacks/ui';
import { Caption, Title } from '@components/typography';
import { truncateMiddle } from '@stacks/ui-utils';
import React from 'react';

export function ContractPreview({
  contractAddress,
  contractName,
  functionName,
  ...rest
}: {
  contractAddress: string;
  contractName: string;
  functionName?: string;
} & StackProps) {
  return (
    <Stack
      p="base"
      borderRadius="12px"
      spacing="base"
      alignItems="center"
      isInline
      border="1px solid"
      borderColor={color('border')}
      _hover={
        rest.onClick
          ? {
              cursor: 'pointer',
            }
          : undefined
      }
      {...rest}
    >
      <DynamicColorCircle
        size="42px"
        position="relative"
        string={`${contractAddress}.${contractName}${functionName ? `::${functionName}` : ''}`}
        backgroundSize="100%"
      />
      <Stack spacing="base-tight">
        <Title as="h3" fontWeight="500">
          {functionName || contractName}
        </Title>
        <Caption>
          {truncateMiddle(contractAddress, functionName ? 4 : 6)}
          {functionName ? `.${contractName}` : ''}
        </Caption>
      </Stack>
    </Stack>
  );
}
