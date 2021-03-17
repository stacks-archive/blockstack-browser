import React from 'react';
import { Box, Stack, StackProps } from '@stacks/ui';
import { Text, Caption } from '@components/typography';
import { AssetAvatar } from '@components/stx-avatar';

interface AssetRowProps extends StackProps {
  name: string;
  contractAddress?: string;
  friendlyName: string;
  value: string;
  subtitle: string;
}

export const AssetRow = React.forwardRef<HTMLDivElement, AssetRowProps>((props, ref) => {
  const { name, contractAddress, friendlyName, value, subtitle, ...rest } = props;
  return (
    <Stack
      spacing="base"
      isInline
      alignItems="center"
      flexWrap="wrap"
      flexDirection="row"
      cursor="pointer"
      width="100%"
      {...rest}
      ref={ref}
    >
      <AssetAvatar
        useStx={name === 'STX' || name === 'Stacks Token'}
        gradientString={contractAddress || name}
        mr="tight"
        size="36px"
        color="white"
      >
        {friendlyName[0]}
      </AssetAvatar>

      <Stack spacing="tight" flexGrow={1}>
        <Text>{friendlyName}</Text>
        <Caption variant="c2">{subtitle}</Caption>
      </Stack>
      <Box textAlign="right" pt="tight">
        <Text fontWeight="400" color="ink.1000">
          {value}
        </Text>
      </Box>
    </Stack>
  );
});
